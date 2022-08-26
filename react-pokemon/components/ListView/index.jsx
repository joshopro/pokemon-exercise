import React, { Component } from "react";
import Flexbox from "flexbox-react";
import { ListItemDisplay, ListItemTitle } from "./styled";
import SaveIndicator from "./SaveIndicator";

class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemon: [],
      search: "",
      offset: 0,
      limit: 20,
      saved: JSON.parse(localStorage.getItem("saved_pokemon")) || {},
    };

    this.handleScroll = this.debounce(this.handleScroll, 100);
  }

  componentDidMount() {
    this.calculateLazyLoading();
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleScroll);
  }

  fetchPokemon = async (search) => {
    const { offset, limit, pokemon } = this.state;
    const url = new URL("/pokemon", window.location.href);
    if (search) url.searchParams.set("search", search);
    url.searchParams.set("offset", offset);
    url.searchParams.set("limit", limit);
    const res = await fetch(url).then((t) => t.json());
    this.setState({
      pokemon: [...pokemon, ...res],
    });
  };

  debouncedSearch = (callback, timeout) => {
    return ({ target: { value } }) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => callback(value), timeout);
    };
  };

  debounce = (callback, timeout) => {
    return (args) => {
      clearTimeout(this.timer2);
      this.timer2 = setTimeout(() => callback(args), timeout);
    };
  };

  onChange = (value) => {
    this.setState({ search: value, offset: 0, pokemon: [] });
    this.fetchPokemon(value);
  };

  calculateLazyLoading = () => {
    const { innerWidth, innerHeight } = window;
    // Get card width based on style of ListItemDisplay and parent
    const cardWidth = innerWidth * 0.17 + 30;
    const viewPortWidth = (innerWidth - 20) * 0.8;
    // Calculate number of cards per axis to be displayed so we have list view completely populated based on screen size
    const cardsPerXAxis = Math.floor(viewPortWidth / cardWidth);
    const cardsPerYAxis = Math.ceil(innerHeight / cardWidth);

    this.setState(
      {
        limit: cardsPerYAxis * cardsPerXAxis,
      },
      () => this.fetchPokemon()
    );
    document.addEventListener("scroll", this.handleScroll);
  };

  handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.setState(
        {
          offset: this.state.offset + this.state.limit,
        },
        () => this.fetchPokemon(this.state.search)
      );
    }
  };

  handleToggleSaved = (name) => {
    const saved = { ...this.state.saved };

    if (saved[name]) {
      delete saved[name];
    } else {
      saved[name] = true;
    }

    localStorage.setItem("saved_pokemon", JSON.stringify(saved));

    this.setState({
      saved,
    });
  };

  render() {
    const { pokemon, saved } = this.state;

    return (
      <Flexbox flexDirection="column" alignItems="center" width="100vw">
        <Flexbox width="250px" marginTop="13px">
          <input
            onChange={this.debouncedSearch(this.onChange, 250)}
            placeholder="Search for a Pokémon!"
          />
        </Flexbox>
        <Flexbox marginTop="15px" padding="0px 10vw">
          <Flexbox flexWrap="wrap">
            {pokemon.map((entry) => {
              return (
                <ListItemDisplay key={entry.name}>
                  <Flexbox key={entry.name} flexDirection="column">
                    <Flexbox key={entry.name} alignItems="center">
                      <SaveIndicator
                        value={!!saved[entry.name]}
                        name={entry.name}
                        onToggle={this.handleToggleSaved}
                      />
                      <ListItemTitle>{entry.name}</ListItemTitle>
                    </Flexbox>
                    <img src={entry.image} />
                  </Flexbox>
                </ListItemDisplay>
              );
            })}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  }
}

export default ListView;
