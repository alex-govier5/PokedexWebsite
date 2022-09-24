import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import fetch from 'node-fetch'
import { PokemonClient } from 'pokenode-ts'
import { MainClient } from 'pokenode-ts'
import { elementAt } from 'rxjs';
import { NgFor, provideCloudflareLoader } from '@angular/common';
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

  preInfo(){
    const input = document.getElementById('search') as HTMLInputElement
    const name = input.value.trim().toLowerCase()
    console.log(name)
    this.setInfo(name)
    input.value=''
  }

  middleInfo(){
    const input = document.getElementById('search') as HTMLInputElement
    const middle = document.getElementById('middle')
    const name=middle?.textContent?.toLowerCase().replace(/['"]+/g,'')!
    console.log(name)
    this.setInfo(name)
    input.value = ''
  }

  leftInfo(){
    const input = document.getElementById('search') as HTMLInputElement
    const left = document.getElementById('left')
    const name=left?.textContent?.toLowerCase().replace(/['"]+/g,'')!
    console.log(name)
    this.setInfo(name)
    input.value = ''
  }

  rightInfo(){
    const input = document.getElementById('search') as HTMLInputElement
    const right = document.getElementById('right')
    const name=right?.textContent?.toLowerCase().replace(/['"]+/g,'')!
    console.log(name)
    this.setInfo(name)
    input.value = ''
  }


  async setInfo(name:string) {
    
    const divy = document.getElementById('result')
    const pic = document.getElementById('picture')
    const left = document.getElementById('left')
    const middle = document.getElementById('middle')
    const right = document.getElementById('right')
    divy!.style.visibility = "visible"
    pic!.style.visibility = "visible"
    left!.style.visibility = "hidden"
    middle!.style.visibility = "hidden"
    right!.style.visibility = "hidden"
    const suggested = document.getElementById('suggested')
    suggested!.style.visibility = "hidden"
    if(name==""){
      suggested!.textContent = "Please enter a pokemon"
      suggested!.style.visibility = "visible"
      divy!.style.visibility = "hidden"
      pic!.style.visibility = "hidden"
      return
    }
    const api = new PokemonClient({cacheOptions:{maxAge:60000, exclude: {query: false}},})
    await api
      .getPokemonByName(name)
      .then((data) => divy!.textContent=data.name.toUpperCase())
      .catch((error) => this.searchDatabase(name)).then((data)=>{return})

    const api2 = new PokemonClient({cacheOptions:{maxAge:60000, exclude: {query: false}},})

    await api2
      .getPokemonByName(name)
      .then((data)=>pic!.style.backgroundImage="url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png)")
      .catch((error)=>pic!.style.backgroundImage="url(/assets/pokeball.jpg)")
    
  }

  isSubstring(one:string, two:string){
    if(one == two){
      return true
    }
    const m = one.length
    const n = two.length
    for(var i = 0; i<n-m; i++){
      var j = 0
      for(j = 0; j<m; j++){
        if(two[i+j] != one[j]){
          break
        }
      }
      if(j==m){
        return true
      }
    }
    return false
  }


  setSuggestions(input:string){
    const left = document.getElementById('left')
    const middle = document.getElementById('middle')
    const right = document.getElementById('right')
    const divy = document.getElementById('result')
    const pic = document.getElementById('picture')
    const suggested = document.getElementById('suggested')
    if(input == middle?.textContent || input == left?.textContent || input == right?.textContent){
      return
    }
    suggested!.textContent="Did you mean?"
    suggested!.style.visibility = "visible"
    if(middle?.textContent == ""){
      middle.style.visibility = "visible"
      middle!.textContent = input
    }
    else if(left?.textContent == ""){
      left.style.visibility = "visible"
      left!.textContent = input
    }
    else{
      right!.style.visibility = "visible"
      right!.textContent = input
    }

    divy!.style.visibility = "hidden"
    pic!.style.visibility = "hidden"
  }

  searchDatabase(name:string){

    const left = document.getElementById('left')
    const middle = document.getElementById('middle')
    const right = document.getElementById('right')
    const divy = document.getElementById('result')
    left!.textContent=""
    middle!.textContent = ""
    right!.textContent = ""

 
    for(var i = 0; i<3; i++){
      for(var x = 0; x<1000; x++){
        this.pokemons.subscribe((next:any) => {
          if(this.isSubstring(name,JSON.stringify(next[x].name))){
            this.setSuggestions(JSON.stringify(next[x].name).toUpperCase())
            return
          }
        })
      }
    }

    if(left?.textContent == "" && middle?.textContent == "" && right?.textContent == ""){
      divy!.textContent = "Sorry, your search yielded no results, try again"
      divy!.style.visibility = "visible"
    }
        
  }

  ngOnInit(): void {
  }

}
