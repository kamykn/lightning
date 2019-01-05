// A dependency graph that contains any wasm must all be imported
// asynchronously. This `bootstrap.js` file does the single async import, so
// that no one else needs to worry about it again.

// Magic Comments
// FYI: https://coredump.ro/questions/50896811/vuecli-30-jsonparraypush-is-undefined-when-the-output-library-code-splits
import("./comlink")
        .catch(e => {
                console.error("Error importing `comlink.js`:", e)
                console.error(e.message)
        });
