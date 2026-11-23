// "What is Thinking Christian?" explainer — copy from the owner's statement
// ("Refusing to Settle for Wholesomeness When Only Holiness Will Do").
export interface ProductContent {
  labelId: string;
  heading: string;
  cta: string;
  description: string;
  cards: {
    grow: { title: string; body: string };
    liquid: { title: string; body: string };
    hands: { title: string; body: string };
  };
}

export const productContent: ProductContent = {
  labelId: "product-title",
  heading: "What is Thinking Christian?",
  cta: "Read the full story",
  description:
    "Thinking Christian is for believers committed to the work of building the body of Christ even when doing so requires us to unsettle the conventions we've inherited.",
  cards: {
    grow: {
      title: "Holiness, not wholesomeness",
      body: "Holiness calls us to be uncompromising as we strive to point to and glorify the Triune God.",
    },
    liquid: {
      title: "Not left. Not right.",
      body: "If you want Scripture to endorse the right or the left without qualification, Thinking Christian will frustrate you.",
    },
    hands: {
      title: "Thinking Christian is for you",
      body: "If you want to consider how God's word exposes the patterns keeping us from being conformed to the image of his Son.",
    },
  },
};
