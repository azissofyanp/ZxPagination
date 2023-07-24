# ZxPagination (Development Branch)

ZxPagination is a lightweight and flexible pagination library for handling paginated data in your web applications. It allows you to easily implement pagination functionality with AJAX data loading support. This is the `dev` branch where new features and improvements are being developed. Please note that the code in this branch is still under development and should not be considered stable for production use.

![GitHub](https://img.shields.io/github/license/azissofyanp/zxpaginations?style=flat-square)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/azissofyanp/zxpaginations/dev?style=flat-square)

## Installation

To use ZxPagination in your project, you can install it via npm:

```
npm install zxpagination
```

Or include the `ZxPagination.js` file in your HTML:

```html
<script src="path/to/ZxPagination.js"></script>
```

## Features

- Dynamic pagination with AJAX data loading.
- Static pagination for pre-loaded data.
- Customizable pagination appearance and behavior.
- Lazy loading of data for better performance.
- Support for custom pagination template.
- Option to use local storage to save pagination state.
- Automatic data fetching on initialization.

## Usage

1. Create a container in your HTML to hold the paginated content:

```html
<div id="contentContainer"></div>
```

2. Create a container for the pagination links:

```html
<div id="paginationContainer"></div>
```

3. Initialize ZxPagination with your options:

```js
const options = {
  axiosConfig: {
    method: "get",
    url: "your-api-endpoint",
  },
  initLoad: true,
  contentDiv: "contentContainer",
  paginationDiv: "paginationContainer",
  loadingHtml: "<p>Loading...</p>",
  template: (dataItem) => `<div>${dataItem.title}</div>`,
  limit: 10,
  mode: "dynamic",
};

const pagination = new ZxPagination(options);
pagination.init();
```

## Configuration Options

Here are the available options you can pass when initializing ZxPagination:

- `axiosConfig`: Configuration object for the Axios AJAX request. (Default: `{ method: "get", url: "" }`)
- `initLoad`: If `true`, ZxPagination will automatically fetch data on initialization. (Default: `true`)
- `contentDiv`: ID of the container to hold the paginated content. (Required)
- `paginationDiv`: ID of the container for pagination links. (Required)
- `loadingHtml`: HTML content to display while data is being fetched. (Default: `<p>Loading...</p>`)
- `template`: A function to generate the HTML for each data item. (Required)
- `limit`: Number of items to display per page. (Default: `10`)
- `mode`: Pagination mode (`dynamic` for AJAX data loading or `static` for pre-loaded data). (Default: `dynamic`)
- `dataSrc`: An array of data to be used in static mode. (Default: `[]`)
- `dataKey`: Key to access the data from the AJAX response. (Default: `data`)
- `noDataHtml`: HTML content to display when there is no data. (Default: `No Data is on Server`)
- `showPreviousNextButtons`: If `true`, display Previous and Next buttons. (Default: `true`)
- `paginationButtonsToShow`: Number of pagination buttons to display. (Default: `5`)
- `onDataFetchSuccess`: Callback function to handle data fetch success.
- `onDataFetchError`: Callback function to handle data fetch error.
- `paginationClass`: CSS class for the pagination container. (Default: `pagination pagination-sm`)
- `activePageClass`: CSS class for the active page link. (Default: `active`)
- `pageItemClass`: CSS class for the pagination item. (Default: `page-item`)
- `pageLinkClass`: CSS class for the pagination link. (Default: `page-link`)
- `customPaginationTemplate`: Custom HTML template for pagination. (Default: `null`)
- `translations`: Object containing translation strings for pagination elements.
- `lazyLoad`: If `true`, enable lazy loading of data. (Default: `false`)
- `initialPagesToLoad`: Number of initial pages to load when lazy loading is enabled. (Default: `1`)
- `localStorageKey`: Key to save pagination state in local storage. (Default: `zx-pagination-state`)
- `useLocalStorage`: If `true`, use local storage to save pagination state. (Default: `true`)

## Lazy Loading

ZxPagination supports lazy loading of data to improve performance when dealing with a large dataset. When `lazyLoad` is set to `true`, ZxPagination will only load data for the initial pages specified in `initialPagesToLoad` and display a "Load More" button to fetch more data when the user clicks on it.

To enable lazy loading, set the `lazyLoad` and `initialPagesToLoad` options accordingly.

## Custom Pagination Template

If you want to customize the appearance of the pagination links, you can use the `customPaginationTemplate` option. Provide a custom HTML template for the pagination container. The default template is a simple unordered list (`<ul>`) with pagination links as list items (`<li>`).

## Use Local Storage

ZxPagination can save the current pagination state to local storage, so the user's pagination choice is persisted even after a page refresh. This is especially useful for maintaining the user's context when they navigate away from the paginated page and return later.

By default, `useLocalStorage` is set to `true`. If you want to disable this feature, set `useLocalStorage` to `false`.

## Contributing

Contributions to ZxPagination are welcome! Feel free to open issues and pull requests for bug fixes, improvements, and new features.

## License

ZxPagination is open-source software licensed under the [MIT license](https://github.com/azissofyanp/zxpaginations/blob/dev/LICENSE).
