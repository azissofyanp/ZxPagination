/**
 * ZxPagination.js
 * Version: 1.1.0
 * Author: Azis Sofyan Prasetyo
 * License: MIT
 * 
 * Disclaimer:
 * This is a lightweight and flexible pagination library designed to handle pagination of data efficiently.
 * While we strive to provide reliable and bug-free code, we cannot guarantee the accuracy, completeness,
 * or performance of this library. Use it at your own risk and always thoroughly test it with your specific
 * use case before deploying it in production.
 * 
 * Please consider contributing to this open-source project and helping us improve it for everyone.
 * Your feedback, bug reports, and pull requests are highly appreciated!
 * 
 * Thank you for using ZxPagination and happy coding!
 */

class ZxPagination {
  constructor(options) {
    this.axiosConfig = options.axiosConfig;
    this.initLoad = options.initLoad;
    this.contentDiv = options.contentDiv;
    this.paginationDiv = options.paginationDiv;
    this.loadingHtml = options.loadingHtml;
    this.noDataHtml = options.noDataHtml || "No Data is on Server";
    this.template = options.template;
    this.limit = options.limit || 10;
    this.mode = options.mode || "dynamic";
    this.dataSrc = options.dataSrc || [];
    this.currentPage = 1;
    this.recordsTotal = 0;
    this.recordsFiltered = 0;
    this.isFetching = false;
    this.dataKey = options.dataKey || "data";
    this.loadingMessageShown = false;
    this.showPreviousNextButtons =
      options.showPreviousNextButtons !== undefined
        ? options.showPreviousNextButtons
        : true;
    this.paginationButtonsToShow = options.paginationButtonsToShow || 5;
    this.onDataFetchSuccess = options.onDataFetchSuccess || null;
    this.onDataFetchError = options.onDataFetchError || null;
    this.paginationClass =
      options.paginationClass || "pagination pagination-sm";
    this.activePageClass = options.activePageClass || "active";
    this.pageItemClass = options.pageItemClass || "page-item";
    this.pageLinkClass = options.pageLinkClass || "page-link";
    this.customPaginationTemplate = options.customPaginationTemplate || null;
    this.translations = options.translations || {};
    this.lazyLoad = options.lazyLoad || false;
    this.initialPagesToLoad = options.initialPagesToLoad || 1;
    this.hasMoreData = true;
    this.localStorageKey = options.localStorageKey || "zx-pagination-state";
    this.useLocalStorage = options.useLocalStorage !== undefined ? options.useLocalStorage : true;
  }

  async fetchData(pageNumber) {
    if (this.isFetching) return;
    this.isFetching = true;

    try {
      this.showLoadingMessage();

      if (this.lazyLoad && pageNumber > this.initialPagesToLoad) {
        this.hasMoreData = false;
        this.hideLoadingMessage();
        return;
      }

      let response;
      if (this.mode === "dynamic") {
        const start = (pageNumber - 1) * this.limit;
        const adjustedStart = start < 0 ? 0 : start;
        response = await axios({
          method: this.axiosConfig.method || "post",
          url: this.axiosConfig.url,
          data: {
            ...this.axiosConfig.data,
            search: this.axiosConfig.data.search,
            start: adjustedStart,
            limit: this.limit,
          },
          headers: this.axiosConfig.headers || {},
        });
      } else {
        const startIndex = (pageNumber - 1) * this.limit;
        const endIndex = startIndex + this.limit;
        const data = this.dataSrc.slice(startIndex, endIndex);
        response = {
          data: { [this.dataKey]: data },
          recordsTotal: this.dataSrc.length,
          recordsFiltered: this.dataSrc.length,
        };
      }

      if (response.data.success) {
        const data = response.data[this.dataKey];
        this.recordsTotal = response.data.recordsTotal;
        this.recordsFiltered = response.data.recordsFiltered;
        this.currentPage = pageNumber;
        this.updateContent(data);
        this.updatePagination();
      } else {
        this.handleFetchError(response.data.notify || "Error: Response data not successful");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      this.handleFetchError("Error: Failed to fetch data. Please try again later.");
    } finally {
      this.isFetching = false;
      this.hideLoadingMessage();
    }
  }

  handleFetchError(message) {
    if (typeof this.onDataFetchError === "function") {
      this.onDataFetchError(message);
    }
    this.updateContent(`<p>${message}</p>`);
  }

  updateContent(data, noDataHtml) {
    const targetContentContainer = document.getElementById(this.contentDiv);
    if (!targetContentContainer) return;

    if (Array.isArray(data)) {
      if (data.length === 0) {
        targetContentContainer.innerHTML = `${noDataHtml}`;
      } else {
        const contentHtml = data.map(this.template).join("");
        targetContentContainer.innerHTML = contentHtml;
      }
    } else if (typeof data === "string") {
      targetContentContainer.innerHTML = data;
    }
  }

  showLoadingMessage() {
    const targetContentContainer = document.getElementById(this.contentDiv);
    if (targetContentContainer) {
      targetContentContainer.innerHTML = this.loadingHtml;
    }
    this.loadingMessageShown = true;
  }

  hideLoadingMessage() {
    if (this.loadingMessageShown) {
      this.loadingMessageShown = false;
    }
  }

  updatePagination() {
    const targetPaginationContainer = document.getElementById(this.paginationDiv);
    if (!targetPaginationContainer) return;

    const numPages = Math.ceil(this.recordsFiltered / this.limit);
    const halfButtons = Math.floor(this.paginationButtonsToShow / 2);
    let startPage = this.currentPage - halfButtons;
    startPage = Math.max(startPage, 1);
    let endPage = startPage + this.paginationButtonsToShow - 1;
    endPage = Math.min(endPage, numPages);

    if (endPage - startPage + 1 < this.paginationButtonsToShow) {
      if (startPage === 1) {
        endPage = Math.min(this.paginationButtonsToShow, numPages);
      } else {
        endPage = numPages;
        startPage = Math.max(1, endPage - this.paginationButtonsToShow + 1);
      }
    }

    let paginationHtml = this.customPaginationTemplate || `<ul class="${this.paginationClass}">`;

    if (this.showPreviousNextButtons && this.currentPage > 1) {
      paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${this.currentPage - 1}" aria-label="${this.translations.prev || 'Previous'}">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `<li class="${this.pageItemClass} ${this.currentPage === i ? this.activePageClass : ''}">
        ${this.currentPage === i ? `<span class="${this.pageLinkClass}">${i}</span>` : `<a class="${this.pageLinkClass}" href="#" data-page="${i}">${i}</a>`}
      </li>`;
    }

    if (this.lazyLoad && this.currentPage >= this.initialPagesToLoad && this.hasMoreData) {
      paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" aria-label="Load More">
          <span aria-hidden="true">${this.translations.loadMore || 'Load More'}</span>
        </a>
      </li>`;
    }

    if (this.showPreviousNextButtons && this.currentPage < numPages) {
      paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${this.currentPage + 1}" aria-label="${this.translations.next || 'Next'}">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;
    }

    paginationHtml += this.customPaginationTemplate ? "" : `</ul>`;
    targetPaginationContainer.innerHTML = paginationHtml;

    const paginationLinks = targetPaginationContainer.querySelectorAll(`.${this.pageLinkClass}`);
    paginationLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const pageNumber = parseInt(event.target.dataset.page, 10);
        this.currentPage = pageNumber;
        this.fetchData(this.currentPage);
      });
    });

    if (this.lazyLoad && this.currentPage >= this.initialPagesToLoad && this.hasMoreData) {
      const loadMoreButton = targetPaginationContainer.querySelector(`.${this.pageLinkClass}[aria-label="Load More"]`);
      if (loadMoreButton) {
        loadMoreButton.addEventListener("click", (event) => {
          event.preventDefault();
          this.handleLoadMoreClick();
        });
      }
    }
  }

  handleLoadMoreClick() {
    if (!this.isFetching && this.hasMoreData) {
      this.currentPage++;
      this.fetchData(this.currentPage);
    }
  }

  init() {
    const targetContentContainer = document.getElementById(this.contentDiv);
    if (!targetContentContainer) return;

    if (this.useLocalStorage) {
      const paginationState = JSON.parse(localStorage.getItem(this.localStorageKey));
      if (paginationState) {
        this.currentPage = paginationState.currentPage || this.currentPage;
        this.recordsTotal = paginationState.recordsTotal || this.recordsTotal;
        this.recordsFiltered = paginationState.recordsFiltered || this.recordsFiltered;
      }
    }

    this.fetchData(this.currentPage);
  }

  async reload() {
    this.currentPage = 1;
    this.hasMoreData = true;
    if (this.useLocalStorage) {
      this.resetLocalStorage();
    }
    await this.fetchData(this.currentPage);
  }

  async updateConfig(options) {
    if (!options) return;

    const {
      axiosConfig,
      initLoad,
      contentDiv,
      paginationDiv,
      loadingHtml,
      template,
      limit,
      mode,
      dataSrc,
      dataKey,
      noDataHtml,
      showPreviousNextButtons,
      paginationButtonsToShow,
      onDataFetchSuccess,
      onDataFetchError,
      paginationClass,
      activePageClass,
      pageItemClass,
      pageLinkClass,
      customPaginationTemplate,
      translations,
      lazyLoad,
      initialPagesToLoad,
      localStorageKey,
      useLocalStorage,
    } = options;

    if (axiosConfig) this.axiosConfig = { ...this.axiosConfig, ...axiosConfig };
    if (initLoad !== undefined) this.initLoad = initLoad;
    if (contentDiv) this.contentDiv = contentDiv;
    if (paginationDiv) this.paginationDiv = paginationDiv;
    if (loadingHtml) this.loadingHtml = loadingHtml;
    if (template) this.template = template;
    if (limit !== undefined) this.limit = limit;
    if (mode) this.mode = mode;
    if (dataSrc) this.dataSrc = dataSrc;
    if (dataKey) this.dataKey = dataKey;
    if (noDataHtml) this.noDataHtml = noDataHtml;
    if (showPreviousNextButtons !== undefined)
      this.showPreviousNextButtons = showPreviousNextButtons;
    if (paginationButtonsToShow)
      this.paginationButtonsToShow = paginationButtonsToShow;
    if (onDataFetchSuccess) this.onDataFetchSuccess = onDataFetchSuccess;
    if (onDataFetchError) this.onDataFetchError = onDataFetchError;
    if (paginationClass) this.paginationClass = paginationClass;
    if (activePageClass) this.activePageClass = activePageClass;
    if (pageItemClass) this.pageItemClass = pageItemClass;
    if (pageLinkClass) this.pageLinkClass = pageLinkClass;
    if (customPaginationTemplate) this.customPaginationTemplate = customPaginationTemplate;
    if (translations) this.translations = translations;
    if (lazyLoad !== undefined) this.lazyLoad = lazyLoad;
    if (initialPagesToLoad !== undefined) this.initialPagesToLoad = initialPagesToLoad;
    if (localStorageKey) this.localStorageKey = localStorageKey;
    if (useLocalStorage !== undefined) this.useLocalStorage = useLocalStorage;

    if (this.initLoad || this.loadingMessageShown) {
      await this.fetchData(this.currentPage);
    }
  }

  resetLocalStorage() {
    if (this.useLocalStorage) {
      localStorage.removeItem(this.localStorageKey);
    }
  }
          }
          
