import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseResponse2(response) {
  const prefix = response.slice(0, 6)
  const content = response.slice(6).trim()

  const responseType =
    {
      "[CODE]": "code",
      "[TEXT]": "text",
    }[prefix] || "unknown"

  return {
    type: responseType,
    content,
  }
}

export function parseResponse(response) {
  const codeRegex = /\[CODE\]([\s\S]*?)(?=\[TEXT\]|\[CODE\]|$)/g
  const textRegex = /\[TEXT\]([\s\S]*?)(?=\[TEXT\]|\[CODE\]|$)/g

  const codeMatches = [...response.matchAll(codeRegex)].map((match) => ({
    type: "code",
    content: match[1].trim(),
  }))

  const textMatches = [...response.matchAll(textRegex)].map((match) => ({
    type: "text",
    content: match[1].trim(),
  }))

  const otherContent = response
    .replace(codeRegex, "")
    .replace(textRegex, "")
    .trim()

  // const otherContent = response
  //   .replace(codeRegex, "")
  //   .replace(textRegex, "")
  //   .replace(/\[\/CODE\]/g, "")
  //   .replace(/\[\/TEXT\]/g, "")
  //   .trim()

  const unknownMatch = otherContent
    ? [
        {
          type: "unknown",
          content: otherContent,
        },
      ]
    : []

  return [...textMatches, ...codeMatches, ...unknownMatch]
}

// export function parseResponse(response) {
//   const codeRegex = /\[CODE\]([\s\S]*?)(?=\[TEXT\]|\[CODE\]|$)/g
//   const textRegex = /\[TEXT\]([\s\S]*?)(?=\[TEXT\]|\[CODE\]|$)/g

//   const codeMatches = [...response.matchAll(codeRegex)].map((match) => ({
//     type: "code",
//     content: match[1].trim(),
//   }))

//   const textMatches = [...response.matchAll(textRegex)].map((match) => ({
//     type: "text",
//     content: match[1].trim(),
//   }))

// const otherContent = response
//   .replace(codeRegex, "")
//   .replace(textRegex, "")
//   .replace(/\[\/CODE\]/g, "")
//   .replace(/\[\/TEXT\]/g, "")
//   .trim()

//   const unknownMatch = otherContent
//     ? [
//         {
//           type: "unknown",
//           content: otherContent,
//         },
//       ]
//     : []

//   return [...textMatches, ...codeMatches, ...unknownMatch]
// }
