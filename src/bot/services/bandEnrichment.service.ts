
// export class EnrichmentService {
//   constructor(
//     private bandFinder: BandFinder,
//   ) {}

//   async enrich(product: Product, chatId?) {
//     const result:Offer = await this.bandFinder.getResults(product.name);
//     console.log({result})
//     if(!result.link){
//       console.error('could not find '+product.name)
//       return;
//     }

//     await this.bandService.update(product.name, result);

//     this.bandHistoryService.add({
//       band: band.name,
//       date: new Date(),
//       html: result.html,
//       link: result.link
//     });
//   }

// }
