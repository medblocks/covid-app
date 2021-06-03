<script>
    import { Link, navigate } from 'svelte-routing';
    import { token } from '../stores.js';
    let username='';
    let password='';
    const login = (username,password) => {
        console.log(username,password);
        localStorage.setItem('token', '1');
        token.set(localStorage.getItem('token'));
        navigate('/', { replace: true });
    };
</script>

<div class="flex flex-col justify-center items-center gap-2">
    <h1 class="text-lg font-bold">Sign in</h1>
<sl-input value={username} placeholder="Username"></sl-input>
<sl-input type='password' value={password} placeholder="Password"></sl-input><sl-button on:click={()=>login(username,password)} type="default">Signin</sl-button>
</div>