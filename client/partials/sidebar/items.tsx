import { Chat } from '@client/pages/chat'
import { Home } from "@client/pages/home";
import { Plugins } from "@client/pages/plugins";
import { HomeIcon, PackageIcon, PlugIcon, CommentIcon } from "@primer/octicons-react";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  logo?: string;
  license?: string;
  homepage?: string;
  repository?: string;
  keywords: string[];
  api_version: string;
}
interface LoadedPlugin {
  id: string;
  metadata?: PluginMetadata;
  has_ui: boolean;
}
export interface ItemType {
  id: string;
  component: React.ComponentType;
  icon: React.ReactNode;
  title?: string;
  isPlugin?: boolean;
  pluginId?: string;
}

const staticItems: ItemType[] = [
  {
    id: "home",
    component: Home,
    icon: <HomeIcon className="fill-current" />,
    title: "Home",
  },
  {
    id: "chat",
    component: Chat,
    icon: <CommentIcon className="fill-current" />,
  },
  {
    id: "plugins",
    component: Plugins,
    icon: <PackageIcon className="fill-current" />,
    title: "Plugins",
  },
];

const callPlugin = async <T = unknown,>(
  pluginId: string,
  method: string,
  args: Record<string, unknown>
): Promise<T> => {
  const result = await invoke<T>("call_plugin", {
    pluginId: pluginId,
    method,
    args,
  });
  return result;
};

const PluginUIRenderer: React.FC<{ pluginId: string }> = ({ pluginId }) => {
  const [ui, setUI] = useState<React.ReactElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wasmContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const loadPluginUI = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await invoke<unknown>("call_plugin", {
          pluginId,
          method: "get_ui",
          args: {},
        });
        if (cancelled) return;
        if (
          result &&
          typeof result === "object" &&
          (result as { type: string }).type === "wasm"        ) {
          setUI(<div ref={wasmContainerRef} />);
          setTimeout(() => {
            if (wasmContainerRef.current) {
              try {
                const mountFn = new Function((result as { mountScript: string }).mountScript);
                if (typeof mountFn === "function") {
                  mountFn(wasmContainerRef.current);
                } else {
                  setError("Invalid mountScript for WASM plugin");
                }
              } catch (e) {
                setError(`Failed to mount WASM plugin: ${e}`);
              }
            }
          }, 0);
        } else if (
          typeof result === "object" &&
          result !== null &&
          "type" in result
        ) {
          const node = result as PluginNode;
          const element = renderPluginNode(node, pluginId);
          setUI(element && React.isValidElement(element) ? element : null);
        } else {
          setUI(<div>{result as string}</div>);
        }
      } catch (err) {
        if (!cancelled) setError(`Failed to load plugin UI: ${err}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadPluginUI();
    return () => {
      cancelled = true;
    };
  }, [pluginId]);

  if (loading) return <div>Loading plugin UI...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!ui) return <div>No UI available for this plugin</div>;
  return <div>{ui}</div>;
};

export function usePluginItems(): ItemType[] {
  const [items, setItems] = useState<ItemType[]>(staticItems);

  const refreshFromBackend = useCallback(async () => {
    try {
      const ids: string[] = await invoke("list_plugins");
      const plugins: LoadedPlugin[] = await Promise.all(
        ids.map(async (id) => {
          try {
            const plugin = await invoke<LoadedPlugin>("get_plugin_info", {
              pluginId: id,
            });
            return plugin;
          } catch (e) {
            console.warn(`Failed to load plugin info for ${id}`, e);
            return null;
          }
        })
      ).then((arr) => arr.filter((p): p is LoadedPlugin => p !== null));
      const pluginItems: ItemType[] = plugins
        .filter((plugin) => plugin.has_ui)
        .map((plugin) => ({
          id: `plugin-${plugin.id}`,
          component: () => <PluginUIRenderer pluginId={plugin.id} />,
          icon: plugin.metadata?.logo ? (
            <img
              src={plugin.metadata.logo}
              alt={plugin.metadata.name}
              className="w-4 h-4"
            />
          ) : (
            <PlugIcon className="fill-current" />
          ),
          title: plugin.metadata?.name || plugin.id,
          isPlugin: true,
          pluginId: plugin.id,
        }));
      setItems([...staticItems, ...pluginItems]);
    } catch (e) {
      console.error("Failed to refresh plugins:", e);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  return items;
}

export { PluginUIRenderer };

type PluginNode =
  | {
      type: "container";
      id: string;
      direction?: "row" | "column";
      style?: React.CSSProperties | null;
      children: PluginNode[];
    }
  | {
      type: "text";
      id: string;
      value: string;
      style?: React.CSSProperties | null;
    }
  | {
      type: "input";
      id: string;
      input_type: string;
      placeholder?: string;
      value?: string | null;
      onChange?: string;
      style?: React.CSSProperties | null;
    }
  | {
      type: "select";
      id: string;
      options: { label: string; value: string }[];
      selected?: string;
      onChange?: string;
      style?: React.CSSProperties | null;
    }
  | {
      type: "button";
      id: string;
      label: string;
      onClick?: string;
      disabled?: boolean | null;
      style?: React.CSSProperties | null;
    };

function getPluginHandlers(pluginId: string) {
  return {
    handle_input_change: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const payload = {
        id: "handle_input_change",
        data: { value: e.target.value },
      };
      const result = await callPlugin<string>(
        pluginId,
        "handle_event",
        payload // <-- pass as object
      );
      return result;
    },
    handle_select_change: async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const payload = {
        id: "handle_select_change",
        data: { value: e.target.value },
      };
      const result = await callPlugin<string>(
        pluginId,
        "handle_event",
        payload
      );
      return result;
    },
    handle_click: async (e: React.MouseEvent<HTMLButtonElement>) => {
      const payload = {
        id: "handle_click",
        data: { value: e.currentTarget.value },
      };
      const result = await callPlugin<string>(
        pluginId,
        "handle_event",
        payload
      );
      return result;
    },
  };
}
function renderPluginNode(node: PluginNode, pluginId: string): React.ReactNode {
  const pluginHandlers = getPluginHandlers(pluginId);

  function getHandler<K extends keyof typeof pluginHandlers>(
    key: K | undefined
  ): (typeof pluginHandlers)[K] | undefined {
    return key && key in pluginHandlers ? pluginHandlers[key as K] : undefined;
  }

  switch (node.type) {
    case "container":
      return (
        <div
          key={node.id}
          style={{
            display: "flex",
            flexDirection: node.direction || "column",
            gap: 8,
            ...(node.style || {}),
          }}
        >
          {node.children.map((child) => renderPluginNode(child, pluginId))}
        </div>
      );
    case "text":
      return (
        <div key={node.id} style={node.style || {}}>
          {node.value}
        </div>
      );
    case "input":
      return (
        <input
          key={node.id}
          type={node.input_type}
          placeholder={node.placeholder}
          value={node.value ?? ""}
          style={node.style || {}}
          onChange={
            getHandler(
              node.onChange as keyof typeof pluginHandlers
            ) as React.ChangeEventHandler<HTMLInputElement>
          }
        />
      );
    case "select":
      return (
        <select
          key={node.id}
          value={node.selected}
          style={node.style || {}}
          onChange={
            getHandler(
              node.onChange as keyof typeof pluginHandlers
            ) as React.ChangeEventHandler<HTMLSelectElement>
          }
        >
          {node.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case "button":
      return (
        <button
          key={node.id}
          type="button"
          style={node.style || {}}
          disabled={!!node.disabled}
          onClick={
            typeof node.onClick === "string" &&
            pluginHandlers[node.onClick as keyof typeof pluginHandlers]
              ? (pluginHandlers[
                  node.onClick as keyof typeof pluginHandlers
                ] as React.MouseEventHandler<HTMLButtonElement>)
              : undefined
          }
        >
          {node.label}
        </button>
      );
    default:
      return null;
  }
}
