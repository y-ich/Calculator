TARGET  = calculator

$(TARGET).min.js: $(TARGET).js
	uglifyjs $< > $@

$(TARGET).js: $(TARGET).coffee
	coffee -c $^

test:
    coffee -c spec

push:
	git push origin gh-pages
