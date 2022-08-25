import React, { Component } from 'react';
import Flexbox from 'flexbox-react';
import { ListItemDisplay, ListItemTitle } from './styled';

class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemon: [],
      offset: 0,
      limit: 20
    };

    this.fetchPokemon = this.fetchPokemon.bind(this);
    this.debouncedSearch = this.debouncedSearch.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.fetchPokemon();
  }

  async fetchPokemon(search) {
    const url = new URL('/pokemon', window.location.href);
    if (search) url.searchParams.set('search', search);
    const res = await fetch(url).then(t => t.json());
    this.setState({
      pokemon: res || []
    });
  }

  debouncedSearch(callback, timeout) {
    return ({ target: { value }}) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => callback(value), timeout);
    };
  }

  onChange(value) {
    console.log(value)
    this.fetchPokemon(value);
  }

  render() {
    const { pokemon } = this.state;
    return (
      <Flexbox flexDirection='column' alignItems='center' width='100vw'>
        <Flexbox width='250px' marginTop='13px'>
          <input onChange={this.debouncedSearch(this.onChange, 250)} placeholder="Search for a Pokémon!"/>
        </Flexbox>
        <Flexbox marginTop='15px' padding='0px 10vw'>
          <Flexbox flexWrap='wrap'>
          {pokemon.map((entry, i) => {
                return (
                  <ListItemDisplay key={entry.name} id={`pokemon-${i}`}>
                    <Flexbox key={entry.name} flexDirection='column'>
                      <ListItemTitle>{entry.name}</ListItemTitle>
                      <img src={entry.image} />
                    </Flexbox>
                  </ListItemDisplay>
                )
              })
            }
          </Flexbox>
        </Flexbox>
      </Flexbox>
    )
  }
}

export default ListView;
