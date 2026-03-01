# make-json-to-env 🚀

A lightweight CLI tool to transform your `JSON` configuration files into `.env` templates instantly. Perfect for generating `.env.example` files without manual typing.

---

## 📦 Installation

You can run it directly without installing using `npx`:

```bash
npx make-json-to-env <filename.json>

```

Or install it globally to use the command anywhere:

```bash
npm install -g make-json-to-env

```

## 🛠 Usage

Once installed, use the `convert-json-env` command followed by your JSON file:

### Basic Conversion

```bash
convert-json-env config.json

```

*This will create a `config.env` file in the same directory.*

### With a Prefix

Use the `--prefix` flag to prepend strings to every line (useful for shell scripts or specific frameworks).

```bash
convert-json-env firebaseConfig.json --prefix="export "

```

---

## 📋 Example

**Input (`example.json`):**

```json
{
  "apiKey": "12345",
  "authDomain": "app.firebaseapp.com",
  "projectId": "my-app"
}

```

**Command:**

```bash
convert-json-env example.json --prefix="export "

```

**Output (`example.env`):**

```env
APP_NAME="My Cool App"
PORT=8080
DB_ENABLED=true
```

---

## ✨ Features

* **No Dependencies:** Light as a feather, uses native Node.js modules.
* **Smart Naming:** Automatically generates the output filename based on your input.
* **Case Formatting:** Automatically converts keys to `UPPER_CASE` for standard `.env` compliance.
* **Security First:** Helps you create `.env.example` files so you never accidentally commit your real secrets.
