# gatsby-transformer-po

Gatsby transformer plugin for PO files.

## Install

`npm install --save @allboatsrise/gatsby-transformer-po`

Note: You generally will use this plugin together with the [gatsby-source-filesystem](https://www.npmjs.com/package/gatsby-source-filesystem) plugin. gatsby-source-filesystem reads in the files then this plugin transforms the files into data you can query.

## How to use

If you put your `.po` files in `./src/intl`:


```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/intl/`,
      },
    },
    {
      resolve: 'gatsby-transformer-po',
      options: {
        // Possible values:
        //   1. `({node: GatsbyApiNode, object: PO}) => string` - callback called for each file expecting locale string to be returned
        //   2. fixed string (e.g 'en-us') 
        //   3. Dynamically determined from filename: en_US.po => 'en-us' (default)
        locale: undefined,

        // when true, msgstr is set to first string, otherwise this will be an array of strings
        forceSingleMsgStr: undefined,

        // used when creating node to define type (default: 'Po')
        typeName: undefined,
      }
    }
  ]
}
```

## How to query

You'd be able to query your translations like:

```graphql
{
  allPo {
    edges {
      node {
        msgid
        locale
        msgstr
        namespace
      }
    }
  }
}
```

## Plugin Development
`npm run watch` - run in background while developing in order to automatically build code when files modified
`npm run build` - run once to build the code
`npm run clean` - removes built files