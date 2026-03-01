# 🚀 make-json-to-env

**The ultimate zero-dependency CLI tool to transform complex, nested JSON into clean, production-ready `.env` files.**

---

## 💡 Why `make-json-to-env`?

Most JSON-to-ENV converters stop at the first level or handle arrays poorly. `make-json-to-env` was built to solve the "Deep Config" problem. Whether you have a 10-level nested Firebase config or a simple flat JSON, this tool generates a standard, predictable `.env` structure that works with `dotenv`, Docker, and Shell scripts.

---

## 🔥 Features

* **⚡ Ultra-Lightweight** – Zero dependencies. It uses native Node.js `fs` and `path` modules.
* **🌳 Infinite Recursion** – No depth limits. It flattens deep objects into a `PARENT_CHILD_KEY` convention.
* **🔢 Intelligent Array Mapping** – Converts arrays into indexed variables (e.g., `TAGS_0`, `TAGS_1`).
* **🛡️ Built with TypeScript** – Fully type-safe with robust error handling for invalid JSON.
* **⚙️ Prefix Support** – Prepend `export `, `SET `, or `REACT_APP_` to every variable automatically.
* **🚫 Smart Flattening Toggle** – Use `--no-flatten` if you want nested objects to stay as JSON strings.

---

## 📦 Installation

### Use without installing (Recommended)

```bash
npx make-json-to-env config.json

```

### Global Installation

```bash
npm install -g make-json-to-env

```

---

## 🛠 Usage & Commands

The tool provides the `make-json-to-env` command.

### 1. Basic Conversion

Converts `config.json` to `config.env`.

```bash
make-json-to-env config.json

```

### 2. Using Custom Prefixes

Great for shell scripts or specific frameworks (like Create React App).

```bash
make-json-to-env config.json --prefix="export "

```

### 3. Disabling Flattening

Keep nested objects as serialized strings.

```bash
make-json-to-env data.json --no-flatten

```

---

## 📋 Deep-Flattening Example

**Input (`settings.json`):**

```json
{
  "server": {
    "port": 3000,
    "auth": {
      "methods": ["google", "github"],
      "enabled": true
    }
  },
  "log_level": "info"
}

```

**Output (`settings.env`):**

```env
SERVER_PORT=3000
SERVER_AUTH_METHODS_0=google
SERVER_AUTH_METHODS_1=github
SERVER_AUTH_ENABLED=true
LOG_LEVEL=info

```

---

## 🚀 Advanced Flag Reference

| Flag | Type | Description |
| --- | --- | --- |
| `<filename>` | `string` | **Required.** The path to your JSON source file. |
| `--prefix` | `string` | Prepend a string to every key (e.g., `--prefix="VITE_"`). |
| `--no-flatten` | `boolean` | Stops recursion. Nested objects are saved as JSON strings. |

---

## 🛠 Development & Contributing

Contributions are welcome! To set up the project locally:

1. **Clone the repo:** `git clone https://github.com/ajay-vish/make-json-to-env.git`
2. **Install types:** `npm install`
3. **Build from TS:** `npm run build`
4. **Test locally:** `node dist/index.js example.json`

---

## 📄 License

Distributed under the **MIT License**. See the `LICENSE` file for full text.

---

## ⭐️ Support

If this tool saved you time, please give it a star on [GitHub](https://github.com/ajay-vish/make-json-to-env)!

---