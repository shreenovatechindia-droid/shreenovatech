<?php
header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
    'http://localhost:5173',
    'http://localhost:3001',
    'https://shreenovatech.in',
    'https://www.shreenovatech.in',
    'https://shreenovatech.vercel.app',
];
if (in_array($origin, $allowed)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/functions.php';
require_once __DIR__ . '/../helpers/jwt.php';

$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base   = '/shreenovatech/backend/api';
$path   = trim(str_replace($base, '', $uri), '/');
$parts  = explode('/', $path);
$method = $_SERVER['REQUEST_METHOD'];

$resource = $parts[0] ?? '';
$id       = isset($parts[1]) && $parts[1] !== '' ? $parts[1] : null;
$action   = isset($parts[2]) && $parts[2] !== '' ? $parts[2] : null;

switch ($resource) {
    case 'auth':
        require_once __DIR__ . '/../controllers/AuthController.php';
        $c = new AuthController();
        if ($id === 'login')        $c->login();
        elseif ($id === 'logout')   $c->logout();
        elseif ($id === 'me')       $c->me();
        elseif ($id === 'forgot')   $c->forgotPassword();
        elseif ($id === 'reset')    $c->resetPassword();
        else err('Not found', 404);
        break;

    case 'portfolio':
        require_once __DIR__ . '/../controllers/PortfolioController.php';
        $c = new PortfolioController();
        if ($method === 'GET'    && !$id) $c->index();
        elseif ($method === 'GET'    && $id) $c->show((int)$id);
        elseif ($method === 'POST'   && !$id) $c->store();
        elseif ($method === 'PUT'    && $id) $c->update((int)$id);
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'pricing':
        require_once __DIR__ . '/../controllers/PricingController.php';
        $c = new PricingController();
        if ($method === 'GET' && !$id)   $c->index();
        elseif ($method === 'PUT' && $id) $c->update((int)$id);
        else err('Not found', 404);
        break;

    case 'testimonials':
        require_once __DIR__ . '/../controllers/TestimonialsController.php';
        $c = new TestimonialsController();
        if ($method === 'GET'    && !$id) $c->index();
        elseif ($method === 'POST'   && !$id) $c->store();
        elseif ($method === 'PUT'    && $id) $c->update((int)$id);
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'faq':
        require_once __DIR__ . '/../controllers/FaqController.php';
        $c = new FaqController();
        if ($method === 'GET'    && !$id) $c->index();
        elseif ($method === 'POST'   && !$id) $c->store();
        elseif ($method === 'PUT'    && $id) $c->update((int)$id);
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'bookings':
        require_once __DIR__ . '/../controllers/BookingsController.php';
        $c = new BookingsController();
        if ($method === 'GET'    && !$id) $c->index();
        elseif ($method === 'GET'    && $id) $c->show((int)$id);
        elseif ($method === 'POST'   && !$id) $c->store();
        elseif ($method === 'PUT'    && $id && $action === 'status') $c->updateStatus((int)$id);
        elseif ($method === 'PUT'    && $id) $c->update((int)$id);
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'payments':
        require_once __DIR__ . '/../controllers/PaymentsController.php';
        $c = new PaymentsController();
        if ($method === 'GET'    && !$id) $c->index();
        elseif ($method === 'GET'    && $id) $c->show((int)$id);
        elseif ($method === 'POST'   && !$id) $c->store();
        elseif ($method === 'PUT'    && $id && $action === 'status') $c->updateStatus((int)$id);
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'contact':
        require_once __DIR__ . '/../controllers/ContactController.php';
        $c = new ContactController();
        if ($method === 'GET'    && !$id) $c->index();
        elseif ($method === 'GET'    && $id) $c->show((int)$id);
        elseif ($method === 'POST'   && !$id) $c->store();
        elseif ($method === 'PUT'    && $id && $action === 'reply') $c->reply((int)$id);
        elseif ($method === 'PUT'    && $id) $c->update((int)$id);
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'newsletter':
        require_once __DIR__ . '/../controllers/NewsletterController.php';
        $c = new NewsletterController();
        if ($method === 'GET')       $c->index();
        elseif ($method === 'POST')  $c->store();
        else err('Not found', 404);
        break;

    case 'stats':
        require_once __DIR__ . '/../controllers/StatsController.php';
        $c = new StatsController();
        if ($method === 'GET' && !$id)    $c->index();
        elseif ($method === 'PUT' && $id) $c->update((int)$id);
        else err('Not found', 404);
        break;

    case 'settings':
        require_once __DIR__ . '/../controllers/SettingsController.php';
        $c = new SettingsController();
        if ($method === 'GET')       $c->index();
        elseif ($method === 'PUT')   $c->update();
        else err('Not found', 404);
        break;

    case 'dashboard':
        require_once __DIR__ . '/../controllers/DashboardController.php';
        (new DashboardController())->index();
        break;

    case 'blog':
        require_once __DIR__ . '/../controllers/BlogController.php';
        $c = new BlogController();
        if ($method === 'GET'    && !$id) $c->index();
        elseif ($method === 'GET'    && $id) $c->show((int)$id);
        elseif ($method === 'POST'   && !$id) $c->store();
        elseif ($method === 'PUT'    && $id) $c->update((int)$id);
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'media':
        require_once __DIR__ . '/../controllers/MediaController.php';
        $c = new MediaController();
        if ($method === 'GET')           $c->index();
        elseif ($method === 'POST')      $c->upload();
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'users':
        require_once __DIR__ . '/../controllers/UsersController.php';
        $c = new UsersController();
        if ($method === 'GET'    && !$id) $c->index();
        elseif ($method === 'GET'    && $id) $c->show((int)$id);
        elseif ($method === 'POST'   && !$id) $c->store();
        elseif ($method === 'PUT'    && $id) $c->update((int)$id);
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'seo':
        require_once __DIR__ . '/../controllers/SeoController.php';
        $c = new SeoController();
        if ($method === 'GET' && !$id)    $c->index();
        elseif ($method === 'GET' && $id) $c->show($id);
        elseif ($method === 'PUT' && $id) $c->update($id);
        else err('Not found', 404);
        break;

    case 'hosting':
        require_once __DIR__ . '/../controllers/HostingController.php';
        $c = new HostingController();
        if ($method === 'GET'    && !$id) $c->index();
        elseif ($method === 'POST'   && !$id) $c->store();
        elseif ($method === 'PUT'    && $id) $c->update((int)$id);
        elseif ($method === 'DELETE' && $id) $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    case 'track':
        require_once __DIR__ . '/../controllers/TrackController.php';
        (new TrackController())->track();
        break;

    case 'notifications':
        require_once __DIR__ . '/../controllers/NotificationsController.php';
        $c = new NotificationsController();
        if ($method === 'GET')                          $c->index();
        elseif ($method === 'PUT' && $id === 'read-all') $c->markAllRead();
        elseif ($method === 'PUT' && $id)               $c->markRead((int)$id);
        elseif ($method === 'DELETE' && $id)            $c->destroy((int)$id);
        else err('Not found', 404);
        break;

    default:
        err('API endpoint not found', 404);
}
