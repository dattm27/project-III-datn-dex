import request from "graphql-request";
import { useState, useEffect } from "react";
import { API_URL_SUB_GRAPH } from "src/constants";

export const endpoint = API_URL_SUB_GRAPH;

export const useFetchGql = <T>(query: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

 
  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await request<T>(endpoint, query);
        console.log(response)
        if (response) { setData(response); 
        
        };

      }
      catch (error) {
        setError(true);
        console.log(error);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchData();

  }, [query])

  return { data, loading, error };
}
