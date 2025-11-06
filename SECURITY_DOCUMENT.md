# Kukuconnect API Security Audit & Remediation (OWASP Top 10)

## 1. Introduction

This document details a security audit of the Kukuconnect API, performed against the OWASP Top 10 vulnerabilities. Each section outlines the identified problem ("Problem") and the corresponding remediation steps and code changes ("Solution") that were implemented to secure the application.

---

## 2. OWASP Top 10 Vulnerability Remediation

### A05: Security Misconfiguration

* **Problem:** The application had multiple critical misconfigurations in `settings.py`. The `SECRET_KEY` was hardcoded, `DEBUG` was set to `True`, `ALLOWED_HOSTS` was set to `['*']`, and `CORS_ALLOW_ALL_ORIGINS` was `True`. This exposed sensitive keys and left the application wide open to host header attacks and insecure cross-origin requests.

* **Solution:** All hardcoded secrets and environment-specific settings were removed from `settings.py` and replaced with environment variables loaded via `os.environ.get()`. The `python-dotenv` library was added to manage local development. `DEBUG` now defaults to `False`, and `CORS_ALLOW_ALL_ORIGINS` is set to `False`, forcing validation against the `CORS_ALLOWED_ORIGINS` list.

* **Code Snippets (`KUKUCONNECT/settings.py`):**

    **Before (Vulnerable):**
    ```python
    # SECURITY WARNING: keep the secret key used in production secret!
    SECRET_KEY = 'django-insecure-x+5fh32v2@su4$d&3cvydn%kdn9p$x546de6h%-uhamnj30fnp'

    # SECURITY WARNING: don't run with debug turned on in production!
    DEBUG = True

    ALLOWED_HOSTS = ['*']

    CORS_ALLOW_ALL_ORIGINS = True
    ```

    **After (Secure):**
    ```python
    from dotenv import load_dotenv
    import os
    
    # Load .env file
    load_dotenv(os.path.join(BASE_DIR, '.env'))

    # FIXED: Now reads from environment variable.
    SECRET_KEY = os.environ.get('SECRET_KEY')

    # FIXED: Now reads from environment variable, defaults to False.
    DEBUG = os.environ.get('DEBUG', 'False') == 'True'

    # FIXED: Now reads from a comma-separated environment variable.
    ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

    # FIXED: Set to False. This forces Django to use the explicit list below.
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
    ```

---

### A01: Broken Access Control

* **Problem:** Several API endpoints, such as `ProductEditView` and `FarmerProfileDetailView`, only checked if a user was authenticated (`permissions.IsAuthenticated`). They failed to check if the user *owned* the resource they were trying to access. This allowed any logged-in user to view, edit, or delete any other user's products or profile.

* **Solution:** The `get_queryset()` and/or `get_object()` methods on these views were overridden. This ensures that all database lookups are first filtered by the currently authenticated user (`self.request.user`), preventing users from accessing data that does not belong to them.

* **Code Snippets (`products/views.py`):**

    **Before (Vulnerable):**
    ```python
    class ProductEditView(generics.RetrieveUpdateDestroyAPIView):
        queryset = Product.objects.all() # <-- Problem: Fetches ALL products
        serializer_class = ProductSerializer
        permission_classes = [permissions.IsAuthenticated]
    ```

    **After (Secure):**
    ```python
    class ProductEditView(generics.RetrieveUpdateDestroyAPIView):
        queryset = Product.objects.all()
        serializer_class = ProductSerializer
        permission_classes = [permissions.IsAuthenticated]

        # ---
        # FIXED: BROKEN ACCESS CONTROL
        # This function ensures that the logged-in user can ONLY
        # edit or delete products that they own.
        # ---
        def get_queryset(self):
            user = self.request.user
            if user.is_authenticated:
                return self.queryset.filter(farmer=user)
            return Product.objects.none()
    ```

---

### A06: Vulnerable and Outdated Components

* **Problem:** A `safety` scan revealed that the project's `requirements.txt` file contained 15 known vulnerabilities across 7 packages, including `Django` itself, `djangorestframework-simplejwt`, and a **CRITICAL** vulnerability in `h11`.

    **Initial Scan Report (Problem):**
    ![Initial Safety Scan Report showing 15 vulnerabilities](./localassets/freshscan.png)

* **Solution:** All vulnerable packages were upgraded to their latest patched versions using `pip install --upgrade`. This also required upgrading `httpcore` to resolve a dependency conflict. The `requirements.txt` file was then regenerated. A follow-up scan confirms all 15 vulnerabilities were resolved.

    **Final Scan Report (Solution):**
    ![Final Safety Scan Report showing 0 vulnerabilities](./localassets/finalscan.png)

---

### A07: Identification and Authentication Failures

* **Problem:** The default Django password validators were in place but not configured to enforce password strength, allowing users to create weak passwords (e.g., "password123").

* **Solution:** The `AUTH_PASSWORD_VALIDATORS` setting in `settings.py` was modified to enforce a minimum password length of 10 characters, making accounts more resilient to brute-force attacks.

* **Code Snippets (`KUKUCONNECT/settings.py`):**
    ```python
    # FIXED: A07: IDENTIFICATION AND AUTHENTICATION FAILURES
    AUTH_PASSWORD_VALIDATORS = [
        { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator' },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
            # Enforce a stronger minimum length
            'OPTIONS': {
                'min_length': 10,
            }
        },
        { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator' },
        { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator' },
    ]
    ```

---

### A02: Cryptographic Failures

* **Problem:** The application did not enforce HTTPS in production. This meant that sensitive data, including user passwords and authentication tokens (JWTs), could be transmitted in plain text and intercepted.

* **Solution:** Production-only security settings were added to `settings.py` inside an `if not DEBUG:` block. These settings enforce `SECURE_SSL_REDIRECT` (force HTTPS), set `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE` (cookies only sent over HTTPS), and enable `HSTS` (HTTP Strict Transport Security). `SECURE_PROXY_SSL_HEADER` was also added, which is essential for deployments behind a proxy like Render.

* **Code Snippets (`KUKUCONNECT/settings.py`):**
    ```python
    # FIXED: A02: CRYPTOGRAPHIC FAILURES
    # Added Production-Only Security Settings to enforce HTTPS.
    if not DEBUG:
        # Tell Django to trust the 'X-Forwarded-Proto' header from Render's proxy
        SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
        
        # 1. Force all connections to be over HTTPS (SSL)
        SECURE_SSL_REDIRECT = True
        
        # 2. Tell the browser to only send session cookies over HTTPS
        SESSION_COOKIE_SECURE = True
        
        # 3. Tell the browser to only send the CSRF cookie over HTTPS
        CSRF_COOKIE_SECURE = True
        
        # 4. Enable HTTP Strict Transport Security (HSTS)
        SECURE_HSTS_SECONDS = 3600  # 1 hour (can be increased after testing)
        SECURE_HSTS_INCLUDE_SUBDOMAINS = True
        SECURE_HSTS_PRELOAD = True
    ```

---

### A09: Security Logging and Monitoring Failures

* **Problem:** The application had no `LOGGING` configuration. This meant that in the event of an error or a potential attack (like brute-force attempts or access control probes), no records would be generated, making investigation and response impossible.

* **Solution:** A comprehensive `LOGGING` dictionary was added to `settings.py`. It configures a `console` handler, which is captured by Render's Log Stream, to log all `INFO` level events and higher. It also specifically captures `django.security` warnings.

* **Code Snippets (`KUKUCONNECT/settings.py`):**
    ```python
    # FIXED: A09: SECURITY LOGGING AND MONITORING FAILURES
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'verbose': {
                'format': '{levelname} {asctime} {module} {message}',
                'style': '{',
            },
        },
        'handlers': {
            'console': {
                'level': 'INFO', # Capture INFO and above
                'class': 'logging.StreamHandler',
                'formatter': 'verbose',
            },
        },
        'loggers': {
            'django': {
                'handlers': ['console'],
                'level': 'INFO',
                'propagate': True,
            },
            'django.security': {
                'handlers': ['console'],
                'level': 'WARNING', # Capture all security warnings
                'propagate': False,
            },
        },
    }
    ```

---

### A03: Injection (SQLi & XSS)

* **Problem:** Potential for SQL Injection (SQLi) if raw SQL queries were built with user input, or Cross-Site Scripting (XSS) if user-supplied data was rendered as raw HTML on the frontend.
* **Solution:** **No vulnerability found.** The application is secure by default:
    1.  **SQLi:** The backend exclusively uses the Django ORM, which parameterizes all queries and automatically prevents SQL injection.
    2.  **XSS:** The frontend is a React application, which inherently escapes data by default, preventing user-supplied strings from being executed as scripts.

---

### A08: Software and Data Integrity Failures

* **Problem:** Potential for Remote Code Execution (RCE) if the application used insecure deserialization methods (like `pickle`) on data provided by a user.
* **Solution:** **No vulnerability found.** The application correctly uses JSON for all API communication. Unlike `pickle`, JSON is a data-only format and cannot be used to execute arbitrary code.

---

### A10: Server-Side Request Forgery (SSRF)

* **Problem:** Potential for an attacker to trick the server into making requests to internal or arbitrary external URLs.
* **Solution:** **No vulnerability found.** No part of the application accepts a URL from a user and then makes a network request to it. All external API calls (e.g., to Mpesa) use hardcoded, trusted URLs.

---

### A04: Insecure Design

* **Problem:** This is a high-level category that reflects a lack of security-first thinking. The presence of A05 (Misconfiguration) and A01 (Broken Access Control) demonstrated that the initial design was insecure.
* **Solution:** This vulnerability was resolved by fixing all the other technical flaws. By implementing proper access control, securing secrets, enforcing HTTPS, and adding logging, the application's design is now fundamentally secure.