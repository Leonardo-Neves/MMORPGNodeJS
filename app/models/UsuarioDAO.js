function UsuarioDAO (connection)
{
	this._connection = connection();
}

UsuarioDAO.prototype.inserirUsuario = function (usuario)
{
	this._connection.open(function(erro, mongoclient) // Abrindo a conexão com o servidor
	{
		mongoclient.collection("usuarios", function(erro, collection) {
			collection.insert(usuario);

			mongoclient.close();
		});
	});
}

UsuarioDAO.prototype.autenticar = function (usuario, req, res) // Login
{
	this._connection.open(function(err, mongoclient) // Abrindo a conexão com o servidor
	{
		mongoclient.collection("usuarios", function(err, collection) {

			collection.find(usuario).toArray(function (err, result) {
				
				if(result[0] != undefined)
				{
					req.session.autorizado = true; // Criando uma Sessão
					// Esse autorizado pode ser qualquer nome
					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;
				}
				

				if(req.session.autorizado)
				{
					res.redirect("jogo");
				}
				else
				{
					res.render("index", { validacao : {}  })
				}

				
			});

			mongoclient.close();
		});
	});
}

module.exports = function () 
{
	return UsuarioDAO;
}