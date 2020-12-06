// DESCRIPTION: new post
// creates a new post

const fs = require('fs')

// config
const cfg = require('./cfg.js')

// initialize readline
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

// ask the posts title
readline.question('post title: ', title => {

	// get current date
	const d = new Date(Date.now())
	const year = d.getFullYear()
	const month = d.getMonth() + 1
	const day = d.getDay() + 1

	// generate file path
	const name = [year, month, day, title].join('-')
	const path = `${cfg.posts_dir}/${name}.md`

	// write file
	fs.writeFileSync(path, `# ${title}\n`)

	// halt readline
	readline.close();

});
