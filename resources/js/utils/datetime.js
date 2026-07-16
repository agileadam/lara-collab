import { router } from "@inertiajs/react";
import dayjs from "dayjs";

const DEFAULT_DATE_FORMAT = "D. MMM YYYY";

export const dateFormat = () => {
  return router.page?.props?.shared?.dateFormat || DEFAULT_DATE_FORMAT;
};

export const date = (date) => {
  return dayjs(date).format(dateFormat());
};

export const time = (date) => {
  return dayjs(date).format("H:mm") + 'h';
};

export const day = (date) => {
  return dayjs(date).format("dddd");
};

export const dateTime = (datetime) => {
  return dayjs(datetime).format(`${dateFormat()} H:mm`) + 'h';
};

export const diffForHumans = (datetime, withoutSuffix = false) => {
  return dayjs(datetime).fromNow(withoutSuffix);
};
