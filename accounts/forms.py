from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


class registrationForm(forms.Form):
    username = forms.CharField(max_length=16,min_length=3, required=True)
    email = forms.EmailField()
    first_name = forms.CharField(max_length=16, min_length=2, required=True)
    last_name = forms.CharField(max_length=16, min_length=2, required=True)
    password1 = forms.CharField(max_length=16, min_length=8, required=True)
    password2 = forms.CharField(max_length=16, min_length=8, required=True)

    
    
    def clean_username(self):
        username = self.cleaned_data["username"]
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Username already taken.")
        
        return username
    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("email already taken. ")
        
        return email
        
    def clean(self):
        cleaned = super().clean()
        
        p1 = cleaned.get("password1")
        p2 = cleaned.get("password2")
        if p1 != p2:
            raise forms.ValidationError("Passwords must match")
        
        return cleaned            
        
class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)  
class ForgotPasswordForm(forms.Form):
    email = forms.EmailField()

class ResetPasswordForm(forms.Form):
    new_password = forms.CharField(widget=forms.PasswordInput)

    def clean_new_password(self):
        password = self.cleaned_data["new_password"]
        validate_password(password)
        return password
