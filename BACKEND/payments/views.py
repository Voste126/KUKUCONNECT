# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from .mpesa import utils

from django.http import HttpResponse, JsonResponse
from django.views.generic import View
from .mpesa.core import MpesaClient
from decouple import config
from datetime import datetime

cl = MpesaClient()
stk_push_callback_url = 'https://api.darajambili.com/express-payment'
b2c_callback_url = 'https://api.darajambili.com/b2c/result'

def index(request):

	return HttpResponse('Welcome to the home of daraja APIs')

def oauth_success(request):
	r = cl.access_token()
	return JsonResponse(r, safe=False)

def stk_push_success(request):
	phone_number = config('MPESA_PHONE_NUMBER')
	amount = 1
	account_reference = 'ABC001'
	transaction_desc = 'STK Push Description'
	callback_url = stk_push_callback_url
	r = cl.stk_push(phone_number, amount, account_reference, transaction_desc, callback_url)
	return JsonResponse(r.response_description, safe=False)