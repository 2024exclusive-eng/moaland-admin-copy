// Only explicit HTTP(S) links are clickable; surrounding shared-post text stays intact.
export function answerParts(value) {
 const text = String(value)
 const expression = /https?:\/\/[^\s<>"'\u3000\u3001\u3002\uff0c\uff1b\uff01\uff09]+/gi
 const parts = []
 let offset = 0
 for (const match of text.matchAll(expression)) {
  const url = match[0].replace(/[.,;!?)\]}]+$/, '')
  if (match.index > offset) parts.push({text:text.slice(offset, match.index)})
  let valid = false
  try { valid = ['http:', 'https:'].includes(new URL(url).protocol) } catch { /* keep invalid input as text */ }
  parts.push({text:url, href:valid ? url : undefined})
  offset = match.index + url.length
 }
 if (offset < text.length) parts.push({text:text.slice(offset)})
 return parts
}
export default function AnswerText({value}) {
 return answerParts(value).map((part, index) => (part.href ? <a key={index} href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a> : <span key={index}>{part.text}</span>))
}
