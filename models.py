'''Makeinf a database object'''
from app import db


class Person(db.Model):
    '''Making a database row'''
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    score = db.Column(db.Integer, nullable=False)


    def __repr__(self):
        '''Returns a username after creating the row'''
        return '<Person %r>' % self.username
