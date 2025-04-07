import { FormInputData, DeparturesResponseBody } from "train-schedule-types";

const useFetchTrainsAPI = () => {
  const url = "http://localhost:3003"; // default port for locally run train api
  const fetchTrainsAPI = async (input: FormInputData): Promise<DeparturesResponseBody> => {
    const { from, to, date, time } = input;
    if (!from || !to || !date || !time) {
      return { error: "Please specify all parameters" };
    }
    const fromFormatted = from.split(" ").join("-");
    const toFormatted = to.split(" ").join("-");
    const timeFormatted = time.split(":").join(".");
    const response = await fetch(
      `${url}/departures/${fromFormatted}/${toFormatted}/${date}/${timeFormatted}`
    );
    const json = await response.json();
    console.log(json);
    return json;
  };
  return { fetchTrainsAPI };
};

export default useFetchTrainsAPI;
