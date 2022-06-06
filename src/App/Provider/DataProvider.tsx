import { ApolloClient, DocumentNode, gql, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { createContext, useContext } from 'react'

type Props = {children:any}

interface IWrapper {
    client:ApolloClient<NormalizedCacheObject>;
    allContinents:DocumentNode;
    countrienByCode:(code: any) => DocumentNode;
}

const DataContext = createContext<IWrapper | null>(null);

export default function DataProvider({children}: Props) {

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        uri: 'https://countries.trevorblades.com'
    });

    const allContinents = gql`
    {
    continents {
        name
        code
    }
    }
    `;
    
    const countrienByCode = (code:any) => gql`
    {
    countries(filter:{
        continent:{eq:"${code}"}
    }) {
        name
        currency
        languages{
        name
        native
        rtl
        }
        capital
        code
    }
    }
    `;

    const wrapped = {
        client,
        allContinents,
        countrienByCode
    }

    return (
    <DataContext.Provider value={wrapped}>{children}</DataContext.Provider>
    )
}

export const useData = () => {
  const dataProvider = useContext(DataContext);
  if (!dataProvider) {
    throw new Error(`You must call useData() inside of a <DataProvider />`);
  }
  return dataProvider;
};

type ID = string; //continent codes

export type Country = {
  code: ID,
  name: String,
  native: String,
  phone: String,
  continent: Continent,
  capital?: String,
  currency?: String,
  languages: [Language],
  emoji: String,
  emojiU: String,
  states: [State],
}

export type Continent = {
  code: ID,
  name: String,
  countries: [Country],
}

type Language = {
  code: ID,
  name?: String,
  native?: String,
  rtl: Boolean,
}

type State = {
  code?: String,
  name: String,
  country: Country,
}