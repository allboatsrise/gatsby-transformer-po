import PO from 'pofile';

interface PluginOptions {
  locale?: (({ node, object }: {node: GatsbyApiNode, object: PO}) => string) | string
  forceSingleMsgStr?: boolean
  typeName?: (({ node, object }: {node: GatsbyApiNode, object: PO}) => string) | string
}

interface GatsbyApiNode {
  id: string
  ext: string
  name: string
  relativePath: string
  absolutePath: string
  relativeDirectory: string
  extension: string
}

interface GatsbyApiCreateNodeParam1 {
  node: GatsbyApiNode
  actions: any
  loadNodeContent: any
  createNodeId: any
  createContentDigest: any
}

export async function onCreateNode({
    node, 
    actions,
    loadNodeContent,
    createContentDigest
  }: GatsbyApiCreateNodeParam1,
  pluginOptions: PluginOptions
) {
  if (node.extension !== 'po') {
    return
  }

  const { createNode, createParentChildLink } = actions

  const content = await loadNodeContent(node)
  const po = PO.parse(content);

  po.items.forEach((item, i) => {
    const locale = getLocale({node, object: po, pluginOptions})
    const namespace = node.relativeDirectory
    const id = `${namespace ? `${namespace}-` : ''}${locale}-${item.msgid}`
    const type = getType({ node, object: po, pluginOptions })

    const jsonNode = {
      ...item,
      msgstr: (item.msgstr && item.msgstr.length > 0 && pluginOptions.forceSingleMsgStr) ? item.msgstr[0] : item.msgstr,
      locale,
      id,
      namespace,
      children: [],
      parent: node.id,
      internal: {
        contentDigest: createContentDigest(item),
        type,
      },
    }
  
    createNode(jsonNode)
    createParentChildLink({ parent: node, child: jsonNode })
  })
}

function getType({node, object, pluginOptions}: {node: GatsbyApiNode, object: PO, pluginOptions:PluginOptions}) : string {
  if (typeof pluginOptions.typeName === 'function') {
    return pluginOptions.typeName({ node, object })
  } else if (typeof pluginOptions.typeName === 'string') {
    return pluginOptions.typeName
  } else {
    return 'Po'
  }
}

function getLocale({ node, object, pluginOptions }: {node: GatsbyApiNode, object: PO, pluginOptions: PluginOptions}) : string {
  if (typeof pluginOptions.locale === 'function') {
    return pluginOptions.locale({ node, object })
  } else if (typeof pluginOptions.locale === 'string') {
    return pluginOptions.locale || 'unknown'
  } else {
    return node.name.toLocaleLowerCase().replace('_', '-');
  }
}
