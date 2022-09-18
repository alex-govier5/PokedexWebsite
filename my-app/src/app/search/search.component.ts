import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor() { }
  
  getPokemon(){
    const searchButton = document.getElementById('btn')
    const inputValue = (<HTMLInputElement>document.getElementById('search')).value;
    searchButton?.addEventListener('click', function handleClick(event) {
      console.log(inputValue)
    })
  }

  ngOnInit(): void {
  }

}
