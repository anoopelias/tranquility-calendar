const amstrongQuotes = [
    `"I think we're going to the moon because it's in the nature of the human being to face challenges. It's by the nature of his deep inner soul... we're required to do these things just as salmon swim upstream."`,
    `"Here men from the planet Earth first set foot upon the Moon. July 1969 AD. We came in peace for all mankind."`,
    `"That's one small step for man, one giant leap for mankind."`,
    `"I guess we all like to be recognized not for one piece of fireworks, but for the ledger of our daily work."`,
    `"It suddenly struck me that that tiny pea, pretty and blue, was the Earth. I put up my thumb and shut one eye, and my thumb blotted out the planet Earth. I didn't feel like a giant. I felt very, very small."`,
    `"The important achievement of Apollo was demonstrating that humanity is not forever chained to this planet and our visions go rather further than that and our opportunities are unlimited."`,
    `"I can honestly say - and it's a big surprise to me - that I have never had a dream about being on the moon."`,
    `"It's a brilliant surface in that sunlight. The horizon seems quite close to you because the curvature is so much more pronounced than here on earth. It's an interesting place to be. I recommend it."`,
    `"As a boy, because I was born and raised in Ohio, about 60 miles north of Dayton, the legends of the Wrights have been in my memories as long as I can remember."`,
    `"Pilots take no special joy in walking. Pilots like flying."`,
    `"Geologists have a saying - rocks remember."`,
    `"Science has not yet mastered prophecy. We predict too much for the next year and yet far too little for the next 10."`,
    `"Gliders, sail planes, they're wonderful flying machines. It's the closest you can come to being a bird."`
];

export function randomAmstrong() {
    return amstrongQuotes[Math.floor(Math.random() * amstrongQuotes.length)];
}

export const moonLanding = `"Houston, Tranquility Base Here. The Eagle Has Landed"`;
