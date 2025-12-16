import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { FunHoverLink } from "./fun-link-hover";

describe("FunHoverLink", () => {
	it("should render children correctly", () => {
		render(
			<BrowserRouter>
				<FunHoverLink to="/test">Click me</FunHoverLink>
			</BrowserRouter>,
		);

		expect(screen.getByText("Click me")).toBeInTheDocument();
	});

	it("should render as a Link with correct href", () => {
		render(
			<BrowserRouter>
				<FunHoverLink to="/about">About Page</FunHoverLink>
			</BrowserRouter>,
		);

		const link = screen.getByRole("link", { name: "About Page" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/about");
	});

	it("should render as a link element", () => {
		render(
			<BrowserRouter>
				<FunHoverLink to="/test">Test</FunHoverLink>
			</BrowserRouter>,
		);

		const link = screen.getByRole("link", { name: "Test" });
		expect(link.tagName).toBe("A");
	});

	it("should forward additional props to Link", () => {
		render(
			<BrowserRouter>
				<FunHoverLink to="/test" data-testid="custom-link" aria-label="Custom">
					Test
				</FunHoverLink>
			</BrowserRouter>,
		);

		const link = screen.getByTestId("custom-link");
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("aria-label", "Custom");
	});

	it("should accept different Link destinations", () => {
		render(
			<BrowserRouter>
				<FunHoverLink to="/home">Home</FunHoverLink>
				<FunHoverLink to="/blog">Blog</FunHoverLink>
				<FunHoverLink to="/contact">Contact</FunHoverLink>
			</BrowserRouter>,
		);

		expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
			"href",
			"/home",
		);
		expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
			"href",
			"/blog",
		);
		expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
			"href",
			"/contact",
		);
	});

	it("should support custom className via props", () => {
		render(
			<BrowserRouter>
				<FunHoverLink to="/test" className="custom-class">
					Test
				</FunHoverLink>
			</BrowserRouter>,
		);

		const link = screen.getByRole("link", { name: "Test" });
		expect(link).toHaveAttribute("class");
	});
});

