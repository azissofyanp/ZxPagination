# ZxPagination

ZxPagination is a lightweight and flexible pagination library for handling pagination of data. It offers both dynamic and static pagination modes and can be easily integrated with server-side or client-side data. With ZxPagination, you can efficiently display large datasets by dividing them into pages and allowing users to navigate through the pages effortlessly.

## Installation

To install ZxPagination, you can include the `ZxPagination.js` file in your project or use it via a package manager like npm or yarn:

```bash
npm install zxpagination
```

## Usage

1. Initialize the ZxPagination object with the required options:

```js
const pagination = new ZxPagination({
  axiosConfig: {
    method: "post",
    url: "/api/data",
    data: { search: "" },
  },
  contentDiv: "content-container",
  paginationDiv: "pagination-container",
  loadingHtml: "<p>Loading...</p>",
  template: (item) => `<div>${item.name}</div>`,
  limit: 10,
  mode: "dynamic",
  onDataFetchSuccess: (data) => {
    // Custom callback function for handling data fetch success
    console.log("Data fetched successfully:", data);
  },
  onDataFetchError: (error) => {
    // Custom callback function for handling data fetch error
    console.error("Error fetching data:", error);
  },
});
```

2. Call the `init()` method to fetch and display the first page of data:

```js
pagination.init();
```

3. To reload the data, use the `reload()` method:

```js
pagination.reload();
```

## Options

- `axiosConfig`: Axios configuration object for making AJAX requests to fetch data.
- `contentDiv`: ID of the container element where the data will be displayed.
- `paginationDiv`: ID of the container element where the pagination buttons will be displayed.
- `loadingHtml`: HTML content to display a loading message while fetching data.
- `template`: Function that generates the HTML for each item in the data.
- `limit`: Number of items to display per page.
- `mode`: Pagination mode (dynamic or static).
- `dataSrc`: Array of data for static pagination mode.
- `dataKey`: Key to access the data in the response object.
- `noDataHtml`: HTML content to display when there is no data available.
- `showPreviousNextButtons`: Boolean to show/hide previous and next buttons (default: true).
- `paginationButtonsToShow`: Number of pagination buttons to display (default: 5).
- `onDataFetchSuccess`: Callback function to handle data fetch success.
- `onDataFetchError`: Callback function to handle data fetch error.
- `paginationClass`: CSS class for the pagination container.
- `activePageClass`: CSS class for the active page button.
- `pageItemClass`: CSS class for the pagination list item.
- `pageLinkClass`: CSS class for the pagination link.

## Contributing

Contributions are welcome! If you'd like to contribute to ZxPagination, please follow the guidelines in the CONTRIBUTING.md file.

## License

ZxPagination is open-source software released under the MIT License. See the LICENSE file for more details.

## Versioning

ZxPagination follows the Semantic Versioning scheme.

## Issue Template

When reporting issues, please use the issue template to provide relevant information about the problem.

## Pull Request Template

For pull requests, follow the guidelines in the pull request template.

## Testing and CI

To run tests, use the following command:

```bash
npm test
```

We also have Continuous Integration set up to ensure that tests are automatically run on every push.

## Documentation

For more detailed documentation, examples, FAQs, and tutorials, visit the `docs/` directory in this repository.

## Release Notes

Please refer to the CHANGELOG.md file for the list of changes and new features in each version.

## Thank you for using ZxPagination! We hope it helps you handle pagination with ease. If you encounter any issues or have suggestions for improvement, feel free to open an issue or submit a pull request. Happy coding!
