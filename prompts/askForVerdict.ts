export function askForVerdict(callTitle: string, madeOn: string, videoTitle: string, viewCount: number, usualViewCount: number): string {
  return [
    `On ${madeOn} you told this creator to make "${callTitle}".`,
    "",
    `They published "${videoTitle}".`,
    `It got ${viewCount} views. They normally get ${usualViewCount}.`,
    "",
    "Were you right or wrong? Say so plainly. Do not soften it.",
    "Then say what you have changed about how you read this audience.",
    "",
    "Reply in exactly this shape and nothing else:",
    "",
    "VERDICT: hit or miss",
    "LESSON: two short sentences about what you now believe"
  ].join("\n");
}
