prepare:
	rustup target add wasm32-unknown-unknown

build-contract:
	cargo build --release -p dragon_lair --target wasm32-unknown-unknown
	wasm-strip target/wasm32-unknown-unknown/release/dragon_lair.wasm 2>/dev/null | true
build-erc20-contract:
	cargo build --release -p erc20 --target wasm32-unknown-unknown
	wasm-strip target/wasm32-unknown-unknown/release/erc20-token.wasm 2>/dev/null | true
build-test-contract:
	cargo build --release -p test --target wasm32-unknown-unknown
	wasm-strip target/wasm32-unknown-unknown/release/dragon_lair_test.wasm 2>/dev/null | true
test-only:
	cargo test -p dragon_lair_tests 

copy-wasm-file-to-test:
	cp target/wasm32-unknown-unknown/release/*.wasm dragon_lair_tests/wasm

test: build-contract build-test-contract build-erc20-contract copy-wasm-file-to-test test-only

clippy:
	cargo clippy --all-targets --all -- -D warnings

check-lint: clippy
	cargo fmt --all -- --check

lint: clippy
	cargo fmt --all

clean:
	cargo clean
	rm -rf dragon_lair_tests/wasm/*.wasm