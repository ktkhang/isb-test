customElements.define(
	'src-loader',
	class extends HTMLElement {
		async connectedCallback() {
			this.shadowRoot || this.attachShadow({ mode: 'open' });
			this.shadowRoot.innerHTML = await (
				await fetch(this.getAttribute('src'))
			).text();
			this.shadowRoot.append(...this.children);
			this.hasAttribute('replaceWith') &&
				this.replaceWith(...this.shadowRoot.children);
		}
	}
);