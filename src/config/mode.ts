let mode = process.env.NODE_ENV;

if (!mode) {
    mode = 'development';
}

export default mode;