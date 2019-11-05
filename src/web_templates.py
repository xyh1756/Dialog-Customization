# -*- coding: utf-8 -*-
from flask import Flask, request, render_template, redirect
from Chatbot.nlu.utils.web_templates.read_templates import ReadTemplates

app = Flask(__name__, static_folder='static/', static_url_path='')


@app.route('/')
def index():
    return redirect('patterns')


@app.route('/patterns')
def patterns():
    page = request.args.get("page")
    page = int(page) if page and int(page) > 0 else 1
    templates = ReadTemplates()
    all_patterns, count, total_page = templates.all_patterns(page, 15)
    all_slots, _, _ = templates.all_slots(1, 999)
    all_features = templates.all_features()
    all_generals = templates.all_generals()
    page = total_page if page > total_page else page
    return render_template('patterns.html', all_patterns=all_patterns, all_slots=all_slots, all_features=all_features, all_generals=all_generals, page=page, count=count, total_page=total_page)


@app.route('/slots')
def slots():
    page = request.args.get("page")
    page = int(page) if page and int(page) > 0 else 1
    templates = ReadTemplates()
    all_slots, count, total_page = templates.all_slots(page, 15)
    page = total_page if page > total_page else page
    return render_template('slots.html', all_slots=all_slots, page=page, total_page=total_page, count=count)


@app.route('/add_pattern', methods=['POST'])
def add_pattern():
    this_type = request.form.get("this_type")
    content = request.form.get("content")
    templates = ReadTemplates()
    templates.add_pattern(this_type, content)
    return 'OK'


@app.route('/del_pattern', methods=['POST'])
def del_pattern():
    pattern_list = request.form.get("pattern_list").split(',')
    templates = ReadTemplates()
    templates.del_pattern(pattern_list)
    return 'OK'


@app.route('/add_feature', methods=['POST'])
def add_feature():
    dict_key = request.form.get("dict_key")
    dict_value = request.form.get("dict_value").split('\n')
    templates = ReadTemplates()
    templates.add_features(dict_key, dict_value)
    return 'OK'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, threaded=True)
