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
    this.initLoad = options.initLoad || false;
    this.contentDiv = options.contentDiv;
    this.paginationDiv = options.paginationDiv;
    this.skeletonHtml = options.skeletonHtml;
    this.noDataHtml = options.noDataHtml || "No Data is on Server";
    this.template = options.template;
    this.limit = options.limit || 10;
    this.mode = options.mode || "client";
    this.processing = options.processing || "client";
    this.dataSrc = options.dataSrc || [];
    this.currentPage = 1;
    this.recordsTotal = 0;
    this.recordsFiltered = 0;
    this.isFetching = false;
    this.dataKey = options.dataKey || "data";
    this.skeletonHtmlShown = false;
    this.showPreviousNextButtons = options.showPreviousNextButtons || false;
    this.paginationButtonsToShow = options.paginationButtonsToShow || 3;
    this.onDataFetchSuccess = options.onDataFetchSuccess || null;
    this.onDataFetchError = options.onDataFetchError || null;
    this.paginationClass =
      options.paginationClass || "pagination pagination-sm mb-0";
    this.activePageClass = options.activePageClass || "active";
    this.pageItemClass = options.pageItemClass || "page-item";
    this.pageLinkClass = options.pageLinkClass || "page-link";

    if (this.initLoad) {
      this.init();
    }
  }

  async fetchData(pageNumber) {
    if (this.isFetching) return;
    this.isFetching = true;

    this.currentPage = pageNumber;

    try {
      this.showSkeletonHtml();

      let start = 0;
      if (this.mode === "client") {
        start = (pageNumber - 1) * this.limit;
      } else if (this.mode === "server") {
        start = (this.currentPage - 1) * this.limit;
      } else {
        throw new Error(`Invalid mode: ${this.mode}`);
      }

      start = Math.max(start, 0);

      let response;
      if (this.mode === "client") {
        // Fetch data from client dataSrc
        const startIndex = start;
        const endIndex = startIndex + this.limit;
        const data = this.dataSrc.slice(startIndex, endIndex);

        response = {
          data: { [this.dataKey]: data },
          recordsTotal: this.dataSrc.length,
          recordsFiltered: this.dataSrc.length,
        };
      } else if (this.mode === "server") {
        // Fetch data from server using axios
        const dataRequest = {
          start: start,
          limit: this.limit,
          ...this.axiosConfig.data,
        };
        response = await axios({
          method: this.axiosConfig.method || "post",
          url: this.axiosConfig.url,
          data: dataRequest,
          headers: this.axiosConfig.headers || {},
        });
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
      this.handleFetchError(error);
    } finally {
      this.isFetching = false;
      this.hideSkeletonHtml();
    }
  }

  handleFetchError(error) {
    console.log(error);
  }

  updateContent(data) {
    const targetContentContainer = document.getElementById(this.contentDiv);
    if (!targetContentContainer) return;

    if (Array.isArray(data)) {
      if (data.length === 0) {
        targetContentContainer.innerHTML = this.noDataHtml;
      } else {
        const contentHtml = data.map(this.template).join("");
        targetContentContainer.innerHTML = contentHtml;
      }
    } else if (typeof data === "string") {
      targetContentContainer.innerHTML = data;
    }
  }

  showSkeletonHtml() {
    const targetContentContainer = document.getElementById(this.contentDiv);
    if (!targetContentContainer) return;
  
    const skeletonHtmlArray = new Array(this.limit).fill(this.skeletonHtml);
    const combinedSkeletonHtml = skeletonHtmlArray.join("");
  
    targetContentContainer.innerHTML = combinedSkeletonHtml;
    this.skeletonHtmlShown = true;
  }
  

  hideSkeletonHtml() {
    if (this.skeletonHtmlShown) {
      this.skeletonHtmlShown = false;
    }
  }

  updatePagination() {
    const targetPaginationContainer = document.getElementById(
      this.paginationDiv
    );
    if (!targetPaginationContainer) return;

    const numPages = Math.ceil(this.recordsTotal / this.limit);
    const halfButtons = Math.floor(this.paginationButtonsToShow / 2);
    let startPage = this.currentPage - halfButtons;
    startPage = Math.max(startPage, 1);
    let endPage = startPage + this.paginationButtonsToShow - 1;
    endPage = Math.min(endPage, numPages);

    const maxVisibleButtons = this.paginationButtonsToShow + 2; // Include prev/next buttons
    const maxPagesToShow =
      numPages > maxVisibleButtons ? maxVisibleButtons : numPages;

    if (numPages > maxVisibleButtons) {
      if (this.currentPage <= halfButtons + 1) {
        endPage = maxPagesToShow - 1;
      } else if (this.currentPage >= numPages - halfButtons) {
        startPage = numPages - maxPagesToShow + 2;
      } else {
        startPage = this.currentPage - halfButtons;
        endPage = this.currentPage + halfButtons;
      }
    }

    let paginationHtml = `<ul class="${this.paginationClass}">`;

    if (this.showPreviousNextButtons && this.currentPage > 1) {
      let dataprevpage = this.currentPage - 1;
      paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${dataprevpage}" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;
    }

    if (startPage > 1) {
      paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="1">1</a>
      </li>`;
      if (startPage > 2) {
        paginationHtml += `<li class="page-item disabled">
          <span class="${this.pageLinkClass}">...</span>
        </li>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `<li class="${this.pageItemClass} ${
        this.currentPage === i ? this.activePageClass : ""
      }">
        <a class="${this.pageLinkClass}" href="#" data-page="${i}">${i}</a>
      </li>`;
    }

    if (endPage < numPages) {
      if (endPage < numPages - 1) {
        paginationHtml += `<li class="page-item disabled">
          <span class="${this.pageLinkClass}">...</span>
        </li>`;
      }
      paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${numPages}">${numPages}</a>
      </li>`;
    }

    if (this.showPreviousNextButtons && this.currentPage < numPages) {
      let datanextpage = this.currentPage + 1;
      paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${datanextpage}" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;
    }

    paginationHtml += `</ul>`;
    targetPaginationContainer.innerHTML = paginationHtml;

    const paginationLinks = targetPaginationContainer.querySelectorAll(
      `.${this.pageLinkClass}`
    );

    paginationLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const pageNumber =
          Number(event.target.getAttribute("data-page")) ??
          Number(
            event.target
              .closest(`.${this.pageItemClass}`)
              .getAttribute("data-page")
          );
        console.log(
          "A Before : " +
            event.target.getAttribute("data-page") +
            "#" +
            pageNumber +
            "#" +
            this.currentPage
        );
        if (pageNumber !== this.currentPage) {
          this.currentPage = pageNumber; // Update the currentPage here
          console.log("B Before : " + pageNumber + "#" + this.currentPage);
          this.fetchData(this.currentPage);
        }
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
      skeletonHtml,
      template,
      limit,
      mode,
      processing,
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
    if (skeletonHtml) this.skeletonHtml = skeletonHtml;
    if (template) this.template = template;
    if (limit !== undefined) this.limit = limit;
    if (mode) this.mode = mode;
    if (processing) this.processing = processing;
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

    if (this.initLoad || this.skeletonHtmlShown) {
      await this.fetchData(this.currentPage);
    }
  }
}
