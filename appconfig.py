# Minimal stdlib-based config reader.
#
# Replaces the `xonfig` package, which is unmaintained and crashes on
# Python 3.10+ (its custom interpolation no longer satisfies configparser's
# isinstance check). Behaviour kept compatible with how app.py used xonfig:
#   - reads config.ini (then an env-specific overlay) from the working dir or a
#     parent directory,
#   - coerces values with ast.literal_eval so ints/floats/bools come back typed,
#   - supports __ENV__SECTION_OPTION environment variable overrides,
#   - keeps option keys case-sensitive.
import ast
import configparser
import os


def _literal_eval(val):
    try:
        return ast.literal_eval(val)
    except (SyntaxError, ValueError):
        return val


class _Interpolation(configparser.Interpolation):
    def before_get(self, parser, section, option, value, defaults):
        return _literal_eval(value)


_config = configparser.ConfigParser(interpolation=_Interpolation())
_config.optionxform = str


def _lookup_dirs():
    cwd = os.path.abspath(os.getcwd())
    return [
        cwd,
        os.path.abspath(os.path.join(cwd, '..')),
        os.path.abspath(os.path.join(cwd, '..', '..')),
    ]


def _read_files():
    env = (os.environ.get('__ENV__') or '').lower()
    env_file = 'config.{}.ini'.format(env) if env in ('testing', 'production') else 'config.development.ini'

    for name in ('config.ini', env_file):
        for directory in _lookup_dirs():
            path = os.path.join(directory, name)
            if os.path.isfile(path):
                _config.read(path)
                break


def _read_env():
    for key, value in os.environ.items():
        if not key.startswith('__ENV__') or len(key) == len('__ENV__'):
            continue
        try:
            section, option = key[len('__ENV__'):].split('_', 1)
        except ValueError:
            continue
        if not _config.has_section(section):
            _config.add_section(section)
        _config.set(section, option, value)


_read_files()
_read_env()


def get_option(section, option):
    return _config.get(section, option)
