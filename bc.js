// DESCRIPTION: blog compiler
// compiles posts from markdown to html

const fs = require('fs')
const md = require('markdown').markdown
const minify = require('html-minifier').minify

// config
const cfg = require('./cfg.js')

// get html first template
const template = fs.readFileSync(`${cfg.meta_dir}/template.html`).toString()

// minifies HTML
function minifyHTML(html) {
	const options = {
		collapseWhitespace: true,
		minifyCSS: true
	}

	return minify(html, options)
}

// compiles posts
function compile() {

	// create the dist dir
	fs.mkdirSync(cfg.dist_dir, { recursive: true })

	// compile and write a file
	async function compile_file(name) {

		// read file
		const path = `${cfg.posts_dir}/${name}`
		const src = fs.readFileSync(path).toString()

		// compile it
		const out = md.toHTML(src)

		// write file
		const new_name = name.substr(0, name.length - 3) + '.html'
		const new_path = `${cfg.dist_dir}/${new_name}`
		fs.writeFileSync(
			new_path,
			minifyHTML(template.replace('<>', out))
		)

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
	const files = fs.readdirSync(cfg.dist_dir)
		.filter(name => name.endsWith('.html'))
		.filter(name => name != 'index.html')
		.reverse()

	// compile them into a list
	let list = []
	for (f of files) {
		const title = f.substr(0, f.length - 5).split('-')[3]
		list.push(`- [${title}](${f})`)
	}

	// compile list to html
	const out = md.toHTML(list.join('\n'))

	// print out to dist_dir/index.html
	fs.writeFileSync(
		`${cfg.dist_dir}/index.html`,
		minifyHTML(template.replace('<>', out))
	)

}

// entry point
compile()
index()
