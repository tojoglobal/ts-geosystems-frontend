export default function getReadingTime(text) {
  const wordsPerMinute = 200;
  const countWords = (text) => text?.trim()?.split(/\s+/)?.length || 0;

  const totalWords = countWords(text);
  const time = Math.ceil(totalWords / wordsPerMinute);

  return {
    text: `${time} min read`,
    minutes: time,
    words: totalWords,
  };
}
