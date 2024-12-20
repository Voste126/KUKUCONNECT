import os
import pytest
from django.test import TestCase
from django_daraja.mpesa.core import MpesaClient
from decouple import config
from django_daraja.mpesa.exceptions import MpesaInvalidParameterException

class MpesaStkPushTestCase(TestCase):
    cl = MpesaClient()
    callback_url = 'https://api.darajambili.com/express-payment'

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        os.environ['LNM_PHONE_NUMBER'] = config('MPESA_PHONE_NUMBER')  # Load the environment variable

    def test_stk_push_empty_description(self):
        '''
        Test that STK push with empty description raises MpesaInvalidParameterException
        '''
        with self.assertRaises(MpesaInvalidParameterException):
            phone_number = config('MPESA_PHONE_NUMBER')
            amount = 1000000
            account_reference = 'reference'
            transaction_desc = ''
            self.cl.stk_push(phone_number, amount, account_reference, transaction_desc, self.callback_url)

    def test_stk_push_empty_reference(self):
        '''
        Test that STK push with empty account reference raises MpesaInvalidParameterException
        '''
        with self.assertRaises(MpesaInvalidParameterException):
            phone_number = config('MPESA_PHONE_NUMBER')
            amount = 1000000
            account_reference = ''
            transaction_desc = 'Description'
            self.cl.stk_push(phone_number, amount, account_reference, transaction_desc, self.callback_url)

    def test_stk_push_invalid_amount(self):
        '''
        Test that STK push with invalid amount raises MpesaInvalidParameterException
        '''
        with self.assertRaises(MpesaInvalidParameterException):
            phone_number = config('MPESA_PHONE_NUMBER')
            amount = 1.5
            account_reference = 'reference'
            transaction_desc = 'Description'
            self.cl.stk_push(phone_number, amount, account_reference, transaction_desc, self.callback_url)

    def test_stk_push_success(self):
        '''
        Test successful STK push
        '''
        phone_number = config('MPESA_PHONE_NUMBER')
        amount = 100
        account_reference = 'reference'
        transaction_desc = 'Description'
        response = self.cl.stk_push(phone_number, amount, account_reference, transaction_desc, self.callback_url)
        self.assertIsNotNone(response)