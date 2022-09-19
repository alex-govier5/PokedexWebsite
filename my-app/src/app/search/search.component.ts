import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import RenderResult from 'next/dist/server/render-result';
import fetch from 'node-fetch'
import { PokemonClient } from 'pokenode-ts'
import { MainClient } from 'pokenode-ts'
import { elementAt } from 'rxjs';
import { provideCloudflareLoader } from '@angular/common';
import { Data } from '@angular/router';
import { map, startWith } from 'rxjs/operators';

const CACHE_KEY = "httpPokemonCache"

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  pokemons:any
  

  constructor(http:HttpClient) { 
    const inp = document.getElementById('search')
    inp?.addEventListener("keypress",function(event){
      if(event.key == "Enter"){
        event.preventDefault()
        document.getElementById('btn')?.click()
      }
    })

    const path = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0"
    this.pokemons = http.get<any>(path)
      .pipe(
        map(data=>data.results)
        )
    this.pokemons.subscribe((next: any)=>{
      localStorage[CACHE_KEY] = JSON.stringify(next)
    })

    this.pokemons = this.pokemons.pipe(
      startWith(JSON.parse(localStorage[CACHE_KEY] || '[]'))
    )
      
  }

  
  onKeydown(event:Event){
      document.getElementById('btn')?.click()
    
  }

  async setInfo() {
    const input = document.getElementById('search') as HTMLInputElement
    const name = input.value.trim().toLowerCase()
    const divy = document.getElementById('result')
    const pic = document.getElementById('picture')
    input.value = ''
    const api = new PokemonClient({cacheOptions:{maxAge:60000, exclude: {query: false}},})
    await api
      .getPokemonByName(name)
      .then((data) => divy!.textContent=data.name.toUpperCase())
      .catch((error) => divy!.textContent="Sorry, your search yielded no results, try again")

    const api2 = new PokemonClient({cacheOptions:{maxAge:60000, exclude: {query: false}},})

    await api2
      .getPokemonByName(name)
      .then((data)=>pic!.style.backgroundImage="url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png)")
      .catch((error)=>pic!.style.backgroundImage="url(/assets/pokeball.jpg)")
    
  }
  ngOnInit(): void {
  }

}
