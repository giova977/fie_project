CREATE DATABASE FIE_Project;

USE FIE_Project;

CREATE TABLE Cliente (
	ID INT NOT NULL,
	TipoPersona VARCHAR(8) NOT NULL,
	RazonSocial VARCHAR(100) NULL,
	Nombres VARCHAR(50) NULL,
	ApellidoPaterno VARCHAR(50) NULL,
	ApellidoMaterno VARCHAR(50) NULL,
	NroDocumento VARCHAR(20) NOT NULL,
	Contraseña VARCHAR(100) NOT NULL
);

ALTER TABLE Cliente
MODIFY Contraseña VARCHAR(100) NOT NULL;

ALTER TABLE Cliente
ADD PRIMARY KEY (ID);

ALTER TABLE Cliente
MODIFY ID INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

INSERT INTO Cliente (ID, TipoPersona, RazonSocial, Nombres, ApellidoPaterno, ApellidoMaterno, NroDocumento, Contraseña) VALUES (1, 'NATURAL', '', 'Mauricio Joaquin', 'Castillo', 'Iman', '78632900', 'maujoPass');

CREATE TABLE Cartera (
	IDCartera INT NOT NULL,
	IDCliente INT NOT NULL,
	TipoCartera VARCHAR(15) NOT NULL,
	TipoTasa VARCHAR(15) NOT NULL,
	TipoMoneda VARCHAR(15) NOT NULL,
	FechaEmision VARCHAR(15) NULL,
	FechaPago VARCHAR(15) NULL,
	PlazoDias INT NOT NULL,
	TipoPlazoTasa VARCHAR(15) NULL,
	ValorTasa VARCHAR(20) NOT NULL,
	PeriodoCapitalizacion VARCHAR(15) NULL,
	ValorNominal VARCHAR(20) NOT NULL,
	CostoInicialTotal VARCHAR(20) NULL,
	CostoFinalTotal VARCHAR(20) NULL,
	Retencion VARCHAR(20) NULL,
	Descuento VARCHAR(20) NOT NULL,
	ValorNeto VARCHAR(20) NOT NULL,
	ValorRecibido VARCHAR(20) NOT NULL,
	ValorEntregado VARCHAR(20) NOT NULL,
	TCEA VARCHAR(20) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP    
);

ALTER TABLE Cartera
ADD PRIMARY KEY (IDCartera);

ALTER TABLE Cartera
MODIFY IDCartera INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

ALTER TABLE Cartera
ADD CONSTRAINT fk_cliente FOREIGN KEY(IDCliente) REFERENCES Cliente(ID);