//import { Browser } from "puppeteer-core";
import { MetalArchivesScraper } from "./metal-archives.scraper";

export class Navigator {
  scrapers:MetalArchivesScraper[] = [];
  constructor(/*private browser: Browser*/) {
    this.scrapers.push(new MetalArchivesScraper(/*this.browser*/));
    this.searchMetalArchives = this.searchMetalArchives.bind(this);
  }

  async searchMetalArchives(query) {
    this.scrapers = this.scrapers ?? [new MetalArchivesScraper(/*this.browser*/)];
    return this.scrapers[0].getDefinition(query);
  }  
}