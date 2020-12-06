// DESCRIPTION: blog compiler
// compiles posts from markdown to html

const fs = require('fs')
const md = require('markdown').markdown
const minify = require('html-minifier').minify

// config
const cfg = require('./cfg.js')

// get html first template
const template = fs.readFileSync(`${cfg.meta_dir}/template.html`).toString()

// compiles markdown to html
function md2html(title, content) {
	const options = {
		collapseWhitespace: true,
		minifyCSS: true
	}

	return minify(
		template
			.replace("{title}", title)
			.replace("{author}", cfg.author)
			.replace("{content}", md.toHTML(content)),
		options
	)
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
		const title =  name.substr(0, name.length - 3).split('-')[3]
		const out = md2html(title, src)

		// write file
		const new_name = name.substr(0, name.length - 3) + '.html'
		const new_path = `${cfg.dist_dir}/${new_name}`
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
	const files = fs.readdirSync(cfg.dist_dir)
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
	const out = md2html(`${cfg.author}'s Blog`, input)

	// print out to dist_dir/index.html
	fs.writeFileSync(`${cfg.dist_dir}/index.html`, out)

}

// entry point
compile()
index()
