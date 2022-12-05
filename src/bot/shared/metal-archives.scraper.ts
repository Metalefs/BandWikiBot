import { bandSearch, } from './models/bandSearch';
import { parse } from 'node-html-parser';
import { config } from '../config';
import { Scraper } from './interfaces/scraper';

import got from 'got';
import { IBandMember, ISong } from './interfaces/IBand';

export class MetalArchivesScraper implements Scraper {
  constructor() {
    this.getDefinition = this.getDefinition.bind(this);
  }
  async getDefinition(query: {name:string,country:string}, link = null) {
    // if (searchPage.includes('No matches found')) {
        //return searchPage
    // }
    // else {
        const bandHref = await this.getBandHrefAsync(query.name) as string;
        const href = bandHref.slice(bandHref.indexOf('href="')+6, bandHref.lastIndexOf('"'))
        console.log(href)
        const pageResponse = await got(href);
        const bandPage = this.getContent(pageResponse as any);
        return this.getData(bandPage, query);
    //}
  }

  private async getData(html, query) {
    const searchResult: bandSearch = new bandSearch();

    const root = parse(html);
  
    try {
        searchResult.name = root.querySelector('h1 a').text;
        searchResult.genres = root.querySelector('#band_stats > dl.float_right > dd:nth-child(2)')?.text;
        searchResult.themes = root.querySelector('#band_stats > dl.float_right > dd:nth-child(4)')?.text;
        searchResult.status = root.querySelector('#band_stats > dl.float_left > dd.active')?.text;
        searchResult.startDate = root.querySelector('#band_stats > dl.clear > dd')?.text;
        searchResult.label = root.querySelector('#band_stats > dl.float_right > dd:nth-child(6) > a')?.text;        
        searchResult.link = query;
        searchResult.about = root.querySelector('.band_comment.clear').text;        
        
        const membersTr = root.querySelectorAll('tr.lineupRow');
        
        searchResult.members = [];
        
        for (const member of membersTr){
            const [age,placeOfBirth] = await this.getMemberAgeAndPlaceOfBirth(member.querySelector('td a').getAttribute('href'))
            
            searchResult.members.push(
                {
                    name: member.querySelector('td a')?.text,
                    role:  member.querySelector('td:nth-child(2)')?.text,
                    wiki: member.querySelector('td a')?.getAttribute('href'),
                    age,
                    placeOfBirth
                } as IBandMember
            )
        }

        const bandLink = root.querySelector('h1 a').getAttribute('href').split('/')
        const bandId = bandLink[bandLink.length -1];
        
        const tabshtml = await this.getBandTabs(bandId);

        const albums = parse(`<html>
        <head></head><body>${tabshtml}</body></html>`);
        const albumHrefs = albums.querySelectorAll('table > tbody > tr > td:nth-child(1) > a');

        searchResult.discography = {
            albums: []
        }

        for (const album of albumHrefs){

            searchResult.discography.albums.push(
                await this.getAlbum(album.getAttribute('href'))
            )
        }

    } catch (ex) {
      console.error('error while searching: ' + ex);
    }

    return searchResult;
  }

  async getMemberAgeAndPlaceOfBirth(link){
    console.log('searching member: ' + link);
    const response = await got(
        link,
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/79.0.3945.0 Safari/537.36'
            }
        }
    );

    const memberPage = this.getContent(response as any);
    const root = parse(memberPage);
    const age = root.querySelector('#member_info > dl.float_left > dd:nth-child(4)')?.textContent;
    const placeOfBirth = root.querySelector('#member_info > dl.float_right > dd:nth-child(2)')?.textContent;

    return [age ?? '',placeOfBirth ??'']
  }

  async getAlbum(albumLink){
    console.log('searching album: ' + albumLink);
    const response = await got(
        albumLink,
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/79.0.3945.0 Safari/537.36'
            }
        }
    );

    const albumPage = this.getContent(response as any);
    const root = parse(albumPage);

    const album:any = {};

    album.name = root.querySelector('#album_info > h1 > a')?.text;
    album.date = root.querySelector('#album_info > dl.float_left > dd:nth-child(4)')?.text;
    
    const songsTr = root.querySelectorAll('#album_tabs_tracklist > div.ui-tabs-panel-content.block_spacer_top_20 > table tr:not(.displayNone)');
    album.songs = [];
    for (const song of songsTr){
        if(song.childNodes.length > 1){
            let lyrics;
            const link = song.querySelector('td[nowrap="nowrap"] a')?.getAttribute('href');
            if(link)
                lyrics = await this.getSongLyrics(link)

            let name = song.childNodes[2].text;
            let duration = song.childNodes.find(n => n.text.includes(":"))?.text;

            if(!name || name.trim() === '') 
                name = song.childNodes[3].text

            duration = duration === name ? song.childNodes[4].text : duration;
            album.songs.push(
                {
                    name,
                    duration,
                    lyrics
                } as ISong
            )
        }
    }

    return album;
  }

  async getBandHrefAsync(bandName){
    console.log('searching bands: ' + bandName);
    const response = await got(
        config.websites.metalArchivesBands(bandName),
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/79.0.3945.0 Safari/537.36'
            }
        }
    )
    
    return JSON.parse(this.getContent(response as any)).aaData[0][0]; 
  }

  async getBandTabs(id){
    console.log('searching tabs: ' + id);
    const response = await got(
        config.websites.metalArchivesBandTabs(id),
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/79.0.3945.0 Safari/537.36'
            }
        }
    )

    return this.getContent(response as any);   
  }

  async getSongLyrics(id){
    console.log('searching lyrics: ' + id);
    const response = await got(
        config.websites.metalArchivesLyrics(id),
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/79.0.3945.0 Safari/537.36'
            }
        }
    )

    return this.getContent(response as any);    
  }

  getContent(response) {
    const buffer = response.rawBody;
    const decoder = new TextDecoder("iso-8859-1");
    return decoder.decode(buffer);
  }
}
