// DESCRIPTION: blog compiler
// compiles posts from markdown to html

const fs = require('fs')
const md = require('markdown').markdown

// config
const cfg = require('./cfg.js')
const meta = fs.readFileSync(`${cfg.posts_dir}/meta.template`).toString()

// compiles posts
function compile() {

	// compile and write a file
	async function compile_file(name) {

		// read file
		const path = `${cfg.posts_dir}/${name}`
		const src = fs.readFileSync(path).toString()

		// compile it
		const out = meta + md.toHTML(src)

		// write file
		const new_path = path.substr(0, path.length - 3) + '.html'
		fs.writeFileSync(new_path, out)

	}

	// get all .md files
	const files = fs.readdirSync(cfg.posts_dir)
		.filter(name => name.endsWith('.md'))

	// compile them
	files.forEach(compile_file)
}

// generates index page
function index() {

	// get all .html fiels
	const files = fs.readdirSync(cfg.posts_dir)
		.filter(name => name.endsWith('.html'))
		.filter(name => name != 'index.html')
		.reverse()

	// compile them into a list
	const list = files
		.map(f => f.substr(0, f.length - 5))
		.map(f => `[${f}](${f}.html)`)
		.join('\n\n')

	// add author's name to top
	let input = `# ${cfg.author}\n` + list

	// compile list to html
	const out = meta + md.toHTML(input)

	// print out to dist_dir/index.html
	fs.writeFileSync(`${cfg.posts_dir}/index.html`, out)

}

// entry point
compile()
index()
