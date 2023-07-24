/**
 * ZxPagination.js
 * Version: 1.0.0
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
  }

  async fetchData(pageNumber) {
    if (this.isFetching) return;
    this.isFetching = true;

    try {
      this.showLoadingMessage();

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
        // Static mode
        const startIndex = (pageNumber - 1) * this.limit;
        const endIndex = startIndex + this.limit;
        const data = this.dataSrc.slice(startIndex, endIndex);

        const response = {
          data: { [this.dataKey]: data },
          recordsTotal: this.dataSrc.length,
          recordsFiltered: this.dataSrc.length,
        };

        if (response.data.success) {
          this.recordsTotal = response.data.recordsTotal;
          this.recordsFiltered = response.data.recordsFiltered;
          this.currentPage = pageNumber; // Update the current page here
          this.updateContent(data);
          this.updatePagination();
        } else {
          this.handleFetchError(response.data.notify);
        }

      }

      if (response.data.success) {
        const data = response.data[this.dataKey];
        this.recordsTotal = response.data.recordsTotal;
        this.recordsFiltered = response.data.recordsFiltered;
        this.currentPage = pageNumber; // Update the current page here
        this.updateContent(data);
        this.updatePagination();
      } else {
        this.handleFetchError(response.data.notify);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      this.handleFetchError();
    } finally {
      this.isFetching = false;
      this.hideLoadingMessage();
    }
  }

  handleFetchError() {
    const errorMsg = "Error fetching data. Please try again later.";
    this.updateContent(`<p>${errorMsg}</p>`);
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
  
    let paginationHtml = `<ul class="${this.paginationClass}">`;
  
    if (this.showPreviousNextButtons && this.currentPage > 1) {
      paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${this.currentPage - 1}" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;
    }
  
    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `<li class="${this.pageItemClass} ${this.currentPage === i ? this.activePageClass : ''}">
        ${this.currentPage === i ? `<span class="${this.pageLinkClass}">${i}</span>` : `<a class="${this.pageLinkClass}" href="#" data-page="${i}">${i}</a>`}
      </li>`;
    }
  
    if (this.showPreviousNextButtons && this.currentPage < numPages) {
      paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${this.currentPage + 1}" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;
    }
  
    paginationHtml += `</ul>`;
    targetPaginationContainer.innerHTML = paginationHtml;
  
    const paginationLinks = targetPaginationContainer.querySelectorAll(`.${this.pageLinkClass}`);
    paginationLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const pageNumber = parseInt(event.target.dataset.page, 10);
        this.currentPage = pageNumber;
        this.fetchData(this.currentPage);
      });
    });
  }
  
  init() {
    const targetContentContainer = document.getElementById(this.contentDiv);
    if (!targetContentContainer) return;

    this.fetchData(1);
  }

  async reload() {
    this.currentPage = 1; // Reset currentPage to 1 before fetching data
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

    if (this.initLoad || this.loadingMessageShown) {
      await this.fetchData(this.currentPage);
    }
  }
}
