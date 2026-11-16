import os
# Extend package search path to the backend app directory
__path__ = [os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend', 'app'))]
