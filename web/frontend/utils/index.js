export const configTime = (timeFormat) => {
  // Create a new Date object with the given time format
  const date = new Date(timeFormat);
  // Days of the week in an pagesay
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Extract the day of the week
  const dayOfWeek = daysOfWeek[date.getDay()];

  // Extract the hour and minute
  const hour = date.getHours();
  const minute = date.getMinutes();

  // Convert the hour to 12-hour format
  const hour12 = hour > 12 ? hour - 12 : hour;

  // Determine whether the time is in AM or PM
  const period = hour >= 12 ? "pm" : "am";

  // Format the converted time
  const convertedTime = `${dayOfWeek} at ${hour12}:${minute
    .toString()
    .padStart(2, "0")} ${period}`;

  // Output the converted time
  return convertedTime;
};

export const sortPages = (pages = [], type) => {
  switch (type) {
    case "az": {
      pages.sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );
      break;
    }

    case "za": {
      pages.sort((a, b) =>
        b.title.toLowerCase().localeCompare(a.title.toLowerCase())
      );
      break;
    }

    case "old": {
      pages.sort((a, b) => {
        if (
          new Date(a.updated_at).getTime() >= new Date(b.updated_at).getTime()
        )
          return 1;
        else return -1;
      });
      break;
    }

    case "new": {
      pages.sort((a, b) => {
        if (
          new Date(a.updated_at).getTime() >= new Date(b.updated_at).getTime()
        )
          return -1;
        else return 1;
      });
      break;
    }
  }

  return pages;
};

export const parserHTML = (html) => {
  let tempt = document.createElement("div");
  tempt.innerHTML = html;
  return tempt.textContent || tempt.innerText || "";
};

export const getSelectedText = () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    return selection.toString();
  }
  return "";
};

export const getLocalFilters = () => {
  const local = localStorage.getItem("filters");
  const localFilter = local ? JSON.parse(local).saveFilters : [];
  return localFilter;
};

export function formatTimeAgo(timestamp) {
  const now = new Date();
  const createdTime = new Date(timestamp);

  const timeDiffInSeconds = Math.floor((now - createdTime) / 1000);
  const timeDiffInMinutes = Math.floor(timeDiffInSeconds / 60);
  const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
  const timeDiffInDays = Math.floor(timeDiffInHours / 24);

  if (timeDiffInSeconds < 60) {
    return "just now";
  } else if (timeDiffInMinutes < 60) {
    return `${timeDiffInMinutes} minutes ago`;
  } else if (timeDiffInHours < 24 && createdTime.getDate() === now.getDate()) {
    const hours = createdTime.getHours().toString().padStart(2, "0");
    const minutes = createdTime.getMinutes().toString().padStart(2, "0");
    return `Today at ${hours}:${minutes} am`;
  } else if (timeDiffInDays <= 1) {
    const hours = createdTime.getHours().toString().padStart(2, "0");
    const minutes = createdTime.getMinutes().toString().padStart(2, "0");
    return `Yesterday at ${hours}:${minutes} am`;
  } else {
    const day = createdTime.getDate().toString().padStart(2, "0");
    const month = (createdTime.getMonth() + 1).toString().padStart(2, "0");
    const year = createdTime.getFullYear();

    const hours = createdTime.getHours().toString().padStart(2, "0");
    const minutes = createdTime.getMinutes().toString().padStart(2, "0");
    return `${month}/${day}/${year} at ${hours}:${minutes}`;
  }
}

const modifiedText = (innerHTML) => {
  let result = innerHTML
    .replace(/<i><b>/g, "<b><i>")
    .replace(/<\/b><\/i>/g, "</i></b>")
    .replace(/<\/b><b>/g, "")
    .replace(/<b><\/b>/g, "")
    .replace(/<b><b>/g, "<b>")
    .replace(/<\/b><\/b>/g, "</b>")
    .replace(/<\/i><i>/g, "")
    .replace(/<i><\/i>/g, "")
    .replace(/<i><i>/g, "<i>")
    .replace(/<\/i><\/i>/g, "</i>")
    .replace(/<\/u><u>/g, "")
    .replace(/<u><\/u>/g, "")
    .replace(/<u><u>/g, "<u>")
    .replace(/<\/u><\/u>/g, "</u>");
  console.log("result", result);
  return result;
};

const getSelectedHTML = (selection) => {
  var tempDiv = document.createElement("div");
  tempDiv.appendChild(selection.getRangeAt(0).cloneContents());
  var selectedHtml = tempDiv.innerHTML;
  return selectedHtml;
};

function hasSingleBTagsPair(str, style) {
  const regex_closing = new RegExp(`<\/${style}>`, "g");
  const regex_opening = new RegExp(`<${style}>`, "g");
  const countOpeningTags = (str.match(regex_opening) || []).length;
  const countClosingTags = (str.match(regex_closing) || []).length;
  const includeOpenTag = str.includes(`<${style}>`);
  const includeCloseTag = str.includes(`</${style}>`);
  const startsWithTag = str.startsWith(`<${style}>`);
  const endsWithTag = str.endsWith(`</${style}>`);
  console.log(countOpeningTags, countClosingTags);
  if (
    (!includeCloseTag && !includeOpenTag) ||
    (startsWithTag &&
      endsWithTag &&
      countClosingTags === 1 &&
      countOpeningTags === 1)
  ) {
    return 0;
  } else if (startsWithTag && !endsWithTag) {
    return 1;
  } else if (endsWithTag && !startsWithTag) {
    return 2;
  } else if (endsWithTag && startsWithTag) {
    return 3;
  } else if (!endsWithTag && !startsWithTag) {
    return 4;
  }
}

export { modifiedText, getSelectedHTML, hasSingleBTagsPair };
