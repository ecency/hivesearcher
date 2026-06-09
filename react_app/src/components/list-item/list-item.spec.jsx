import React from "react";
import { render, cleanup } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { afterEach, it, expect } from "vitest";
import ListItem from "./index";

afterEach(cleanup);

const baseEntry = {
    id: 1,
    author: "foo",
    permlink: "bar",
    category: "test",
    depth: 0,
    author_rep: 50,
    payout: 1.23,
    total_votes: 3,
    children: 2,
    app: "ecency",
    created_at: "2024-01-01T00:00:00Z",
};

// he.decode() inside markedHtml() turns escaped user content back into real
// tags after stripping, so the rendered snippet must keep <mark> highlights but
// drop any other (potentially malicious) tags.
it("keeps <mark> highlights but strips injected tags from marked snippets", () => {
    const entry = {
        ...baseEntry,
        title_marked: "<mark>hello</mark> &lt;img src=x onerror=alert(1)&gt;",
        body_marked: "safe &lt;script&gt;alert(1)&lt;/script&gt; <mark>body</mark>",
    };

    const { container } = render(
        <IntlProvider locale="en-US" defaultLocale="en-US">
            <ListItem entry={entry} />
        </IntlProvider>
    );

    expect(container.querySelector("mark")).toBeTruthy();
    expect(container.querySelector("img.item-image, .item-image img")).toBeTruthy(); // the thumbnail still renders
    expect(container.querySelectorAll("mark").length).toBe(2);
    // injected tags from decoded entities must not reach the DOM
    expect(container.querySelector("img[onerror], img[src='x']")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
});
