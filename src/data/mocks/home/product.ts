/** 04 Product — Figma 3488:21990. Copy is verbatim from the frame. */
export const productMock = {
  head: {
    badge: "content service",
    title: { before: "Most of a process is ", accent: "glue", after: "." },
    aside:
      "Copy this into that. Check it went through. Ask Dana if it is fine. Relay takes the glue and leaves you the decisions.",
  },
  trace: {
    index: "01",
    title: "One canvas, every branch",
    body: "Drop a trigger, add a condition, split the path. A step that fails at 3am is retried four times.",
    run: "run 41982",
    summary: "finished in 129 ms",
    steps: [
      { label: "read refund", value: "120 ms", done: true },
      { label: "check amount", value: "8 ms", done: true },
      { label: "branch, over 5000", value: "1 ms", done: true },
      { label: "ask finance", value: "on Dana", done: false },
    ],
    axis: ["0", "50", "100", "150", "200 ms"],
  },
  approval: {
    index: "02",
    title: "Approvals where people already are",
    body: "Send a step to Slack, get a yes or a no, keep moving. Nobody learns another dashboard.",
    channel: "#finance",
    day: "today",
    sender: "Relay",
    time: "9:41",
    message: "Refund of 6,400 for Northwind is over your limit. Send it?",
    fields: [
      { key: "amount", value: "6,400 USD" },
      { key: "customer", value: "Northwind" },
      { key: "rule", value: "over 5,000 needs a human" },
    ],
    approve: "Approve",
    hold: "Hold",
    waiting: "waiting 26 min",
  },
  chart: {
    index: "03",
    title: "Every run is on the record",
    body: "Inputs, outputs and timings for 90 days. Replay any run before you trust it with money.",
    caption: "runs per weekday",
    average: "62,000 average",
    days: ["mon", "tue", "wed", "thu", "fri", "sat"],
  },
} as const;

export type ProductContent = typeof productMock;
